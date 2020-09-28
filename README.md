# tmlanguage-task-juggler

This repository contains [TextMate language grammar][tmlang] files for [TaskJuggler 3].

The grammar is being developed to be used for Syntax highlighting in [Visual Studio Code].

## References

- [Text Mate language reference][tmlang]
- [VSCode syntax highlighting guide]
- This repository is modeled after the [TypeScript language grammar repository]
- TaskJuggler lanaguage details:
  - [Syntax reference]
  - [Parser rules]
  - Vim syntax file, [included][tjp-vim-syntax] in the TaskJuggler distribution


[tmlang]: https://macromates.com/manual/en/language_grammars
[TaskJuggler 3]: https://taskjuggler.org
[Visual Studio Code]: https://code.visualstudio.com/
[VSCode syntax highlighting guide]: https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide
[TypeScript language grammar repository]: https://github.com/microsoft/TypeScript-TmLanguage
[Parser rules]: https://github.com/taskjuggler/TaskJuggler/blob/master/lib/taskjuggler/TjpSyntaxRules.rb
[Syntax reference]: https://taskjuggler.org/tj3/manual/Getting_Started.html#Structure_of_a_TJP_File
[tjp-vim-syntax]: https://taskjuggler.org/tj3/manual/Installation.html#Installing_the_Vim_Support

## Install dependencies
``` sh
npm install
```

## Build

Compile the yaml file into the tmLanguage file.

The generated files:

- [syntax.tmLanguage](./syntax.tmLanguage)

``` sh
npm run build:grammar
```

## Tests

``` sh
npm test            # Compiles & runs tests

npm run diff        # Diffs the test baselines with generated one using tool set in environment variable DIFF
npm run accept      # Accepts the test baselines
```