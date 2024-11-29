#!/usr/bin/env node

import { Command } from "commander";
import {
  readHtmlFile,
  createMarkdown,
  getNotesFromHtml,
  pushToBear,
} from "./index";

const program = new Command();

program
  .name("kindle2md")
  .description("Import Kindle Book Notes to with a useful format")
  .version("1.0.0");

program
  .argument("<notes-html-file>")
  .description("read notes from file")
  .action((htmlFile) => {
    const htmlContent = readHtmlFile(htmlFile);
    const notes = getNotesFromHtml(htmlContent);
    const markdown = createMarkdown(notes);
    pushToBear(markdown);
  });

program.parse(process.argv);
