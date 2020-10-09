import * as vt from 'vscode-textmate/release/main';
import path = require('path');
import fs = require('fs');


export function generateScopes(text: string) {
    const oriLines = text.split(/\r\n|\r|\n/);
    return tjp3Grammar.then((iGrammar) => generateScopesWorker(
        {iGrammar: iGrammar!},
        oriLines
    ));
}

const grammarPath = path.join(__dirname, '..', 'syntax.tmLanguage');

const registery = new vt.Registry({
    loadGrammar: function (scopeName: string) {
        // TODO: Assert that scopename is 'source.tjp3'
        return new Promise((resolve, reject) => {
            fs.readFile(grammarPath, (error, content) => {
                if (error) {
                    reject(error);
                } else {
                    const rawGrammar = vt.parseRawGrammar(content.toString(), grammarPath);
                    resolve(rawGrammar);
                }
            });
        });
    }
});

const tjp3Grammar = registery.loadGrammar('source.tjp3');

interface Grammar {
    iGrammar: vt.IGrammar;
    ruleStack?: vt.StackElement;
}

function generateScopesWorker(grammar: Grammar, oriLines: string[]): string {
    let cleanLines: string[] = [];
    let baselineLines: string[] = [];
    for (const i in oriLines) {
        let line = oriLines[i];
        const mainLineTokens = tokenizeLine(grammar, line);
        cleanLines.push(line);
        baselineLines.push("")
        for (let token of mainLineTokens) {
            // Render tabs as single space to align with the tokens.
            baselineLines.push(">" + line.replace("\t", " "));
            writeTokenLine(token, baselineLines);
        }
    }
    return render(cleanLines, baselineLines);
}

function tokenizeLine(grammar: Grammar, line: string) {
    const lineTokens = grammar.iGrammar.tokenizeLine(line, grammar.ruleStack!);
    grammar.ruleStack = lineTokens.ruleStack;
    return lineTokens.tokens;
}

function writeTokenLine(token: vt.IToken, outputLines: string[]) {
    let startingSpaces = " ";
    for (let j = 0; j < token.startIndex; j++) {
        startingSpaces += " ";
    }

    let locatingString = "";
    for (let j = token.startIndex; j < token.endIndex; j++) {
        locatingString += "^";
    }
    outputLines.push(startingSpaces + locatingString);
    outputLines.push(`${startingSpaces}${token.scopes.join(' ')}`);
}

function render(oriLines: string[], baselineLines: string[]): string {
    return "original file\n-----------------------------------\n" +
        oriLines.join("\n") +
        "\n-----------------------------------\n\n" +
        baselineLines.join("\n");
}
