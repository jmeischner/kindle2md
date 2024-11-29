# kindle2md
## Motivation

I use the [Kindle Reader](https://www.amazon.com/b?ie=UTF8&node=16571048011) and make highlights and notes on the books I read.
Unfortunately, the Kindle Reader does not provide a way to export these highlights and notes in other ways than HTML.
As I use [Bear](https://bear.app/) to take notes and to fill my [Zettelkasten](https://zettelkasten.de), I wanted to convert these highlights and notes to Markdown format.
This is the motivation behind this project.

## What it does

It converts the Kindle HTML exports

<p align="center">
<img src="/images/notes-html.png" width="450">
</p>

to Markdown and create a new note with the highlights and notes in Bear.

<p align="center">
<img src="/images/notes-bear.png" width="450">
</p>

## Installation

Clone the Repository, install the dependencies and install the CLI globally.

## Usage

```bash
> kindle2md <path-to-html-file>
```

## Contributing

Feel free to contribute to this project. You can open an issue or a pull request.

*Things which would be nice to have:*

- [ ] handle more languages for the naming of the `noteType`. Currently it is only german "Notiz" and "Markierung"
- [ ] have an easier to customize output format (like reading it from an template file or something)
- [ ] configure the tags which are added to the note (currently it is mine: #zettelkasten)
- [ ] maybe generalize this script to not only add the markdown to Bear but also to other note taking apps or simply create a markdown file
- [ ] create CD to publish the package to the npm registry
