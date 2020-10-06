import fs = require('fs');
import path = require('path');
import yaml = require('js-yaml');
import plist = require('plist');

buildGrammar();

interface Grammar {
    name: string;
    scopeName: string;
    fileTypes: string[];
    uuid: string;
    macros?: MapLike<string>;
    patterns: any;
    repository: any;
}

function buildGrammar() {
    const src = path.join(__dirname, '..', 'syntax.yaml');
    const dst = path.join(__dirname, '..', 'syntax.tmLanguage');
    const grammar = yaml.safeLoad(fs.readFileSync(src, "utf8")) as Grammar;
    expandMacros(grammar);
    delete grammar.macros;
    fs.writeFileSync(dst, plist.build(grammar));
}

function expandMacros(grammar: Grammar) {
    if (grammar.macros != undefined) {
        const expansions = loadExpandedMacros(grammar.macros);
        expandMacrosInAllRegexes(grammar.patterns, expansions);
        expandMacrosInAllRegexes(grammar.repository, expansions);
    }
}

type MacroExpansion = [RegExp, string];

function loadExpandedMacros(macros: MapLike<string>) {
    let macroExpansions: MacroExpansion[] = [];
    for (const name in macros) {
        // Expand with macros processed so far.
        const expansion = applyMacroExpansions(macros[name], macroExpansions);
        macroExpansions.push([new RegExp(`{{${name}}}`, "gm"), expansion]);
    }
    return macroExpansions;
}

function applyMacroExpansions(src: string, expansions: MacroExpansion[]) {
    let expanded = src;
    for (const [pattern, expansion] of expansions) {
        expanded = expanded.replace(pattern, expansion)
    }
    return expanded;
}

function expandMacrosInAllRegexes(root: any, expansions: MacroExpansion[]) {
    const regexPropertyNames = ["match", "begin", "end"];
    for (const name of regexPropertyNames) {
        if (name in root) {
            // TODO: assert typeof root[name] === 'string' ?
            // Or do we get this for free from applyMacroExpansions() type?
            root[name] = applyMacroExpansions(root[name], expansions);
        }
    }
    for (var name in root) {
        const child = root[name];
        if (typeof child === 'object') {
            expandMacrosInAllRegexes(child, expansions);
        }
    }
}