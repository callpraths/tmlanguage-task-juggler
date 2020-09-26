import fs = require('fs');
import path = require('path');
import yaml = require('js-yaml');
import plist = require('plist');

buildGrammar();

function buildGrammar() {
    const src = path.join(__dirname, '..', 'syntax.yaml');
    const dst = path.join(__dirname, '..', 'syntax.tmLanguage');

    const grammar = yaml.safeLoad(fs.readFileSync(src, "utf8"));
    fs.writeFileSync(dst, plist.build(grammar));
}