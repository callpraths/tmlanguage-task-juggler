import fs = require('fs');
import path = require('path');
import chai = require('chai');
import build = require('./build');

const generatedFolder = path.join(__dirname, 'generated');
const baselineFolder = path.join(__dirname, 'baselines');
const casesFolder = path.join(__dirname, 'cases');

// Ensure generated folder
ensureCleanGeneratedFolder();

// Generate the new baselines
for (const fileName of fs.readdirSync(casesFolder)) {
    describe("Generating baseline for " + fileName, () => {
        let wholeBaseline: string;
        let parsedFileName: path.ParsedPath;

        before(done => {
            const text = fs.readFileSync(path.join(casesFolder, fileName), 'utf8');
            parsedFileName  = path.parse(fileName);
            build.generateScopes(text).then(result => {
                wholeBaseline = result;
                done();
            })
        });
        after(() => {
            wholeBaseline = undefined!;
            parsedFileName = undefined!;
        });

        it('Comparing baseline', () => {
            assertBaselinesMatch(parsedFileName.name + '.baseline.txt', wholeBaseline);
        });
    });
}

function ensureCleanGeneratedFolder() {
    if (fs.existsSync(generatedFolder)) {
        for (const fileName of fs.readdirSync(generatedFolder)) {
            fs.unlinkSync(path.join(generatedFolder, fileName));
        }
        fs.rmdirSync(generatedFolder);
    }
    fs.mkdirSync(generatedFolder);
}

function assertBaselinesMatch(file: string, generatedText: string) {
    const generatedFileName = path.join(generatedFolder, file);
    fs.writeFileSync(generatedFileName, generatedText);

    const baselineFile = path.join(baselineFolder, file);
    if (fs.existsSync(baselineFile)) {
        chai.assert.equal(generatedText, fs.readFileSync(baselineFile, 'utf8'), "Expected baselines to match: " + file);
    } else {
        chai.assert(false, "New generated baseline");
    }
}