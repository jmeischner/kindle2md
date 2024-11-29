import * as fs from "fs";
import { exec, ExecException } from "node:child_process";
import * as cheerio from "cheerio";

type HTMLContent = string;

interface Note {
  noteHeading: string;
  noteText: string;
  noteType: "Markierung" | "Notiz";
  position: number;
  highlight?: "red" | "blue" | "yellow" | "orange";
}

interface Section {
  sectionHeading: string;
  notes: Note[];
}

interface Book {
  title: string;
  sections: Section[];
}

export function readHtmlFile(filePath: string): HTMLContent {
  // Read the input HTML file
  return fs.readFileSync(filePath, "utf-8");
}

export function getNotesFromHtml(htmlContent: HTMLContent): Book {
  // Load the HTML using cheerio
  const $ = cheerio.load(htmlContent);

  // Prepare an array to store the extracted data
  const sections: Section[] = [];

  const title = $(".bookTitle").first().text().trim();

  // Traverse the sections
  $(".sectionHeading").each((_, sectionElement) => {
    const sectionHeading = $(sectionElement).text().trim();

    // Find all notes related to this section
    const notes: Note[] = [];

    let currentElement = $(sectionElement).next();

    // Continue until the next sectionHeading or end of document
    while (
      currentElement.length &&
      !currentElement.hasClass("sectionHeading")
    ) {
      if (currentElement.hasClass("noteHeading")) {
        const rawNoteHeading = currentElement.text().trim();
        const noteText = currentElement.next(".noteText").text().trim();

        // Extract note type ("mark" or "note")
        const noteType = rawNoteHeading.startsWith("Markierung")
          ? "Markierung"
          : "Notiz";

        // Extract position
        const positionMatch = rawNoteHeading.match(/> Position (\d+)/);
        const position = positionMatch ? parseInt(positionMatch[1], 10) : 0;

        // Remove "Markierung(blau) - " or "Notiz - " and "> Position XXXX" from the note heading
        const noteHeading = rawNoteHeading
          .replace(/Markierung\([^)]+\) - /, "")
          .replace(/Notiz - /, "")
          .replace(/ > Position \d+/, "")
          .trim();

        // Extract highlight color dynamically
        const highlightSpan = currentElement.find("span[class^='highlight_']");
        const highlightMatch = highlightSpan
          .attr("class")
          ?.match(/highlight_(\w+)/);
        const highlight = highlightMatch
          ? (highlightMatch[1] as Note["highlight"])
          : undefined;

        notes.push({
          noteHeading,
          noteText,
          noteType,
          position,
          highlight,
        });
      }

      currentElement = currentElement.next();
    }

    sections.push({
      sectionHeading,
      notes,
    });
  });

  return { title, sections };
}

// The actual bubble color depends on the color bear does support
// and needs a mapping between the ones from Kindle Reader and the
// ones supported by Bear
function getColorBubble(highlight: string | undefined): string {
  switch (highlight) {
    case "blue":
      return "🔵";
    case "yellow":
      return "🟡";
    case "red":
      return "🔴";
    case "orange":
      return "🟣";
  }

  return "";
}

export function createMarkdown(book: Book): string {
  let markdown = `# ${book.title}\n---\n#zettelkasten/> inbox#\n---\n`;

  book.sections.forEach((section) => {
    markdown += `## ${section.sectionHeading}\n\n`;

    section.notes.forEach((note) => {
      markdown += `- [ ] ==${getColorBubble(note.highlight)}${note.noteType}== - **${note.noteHeading}**\n`;
      markdown += `> ${note.noteText}\n\n`;
    });
  });

  return markdown;
}

export function pushToBear(markdown: string): void {
  // Encode the markdown content
  const encodedMarkdown = encodeURIComponent(markdown);

  // Construct the Bear x-callback-url
  const bearURL = `bear://x-callback-url/create?text=${encodedMarkdown}`;

  // Open the URL using the default browser
  exec(`open "${bearURL}"`, (error) => {
    if (error) {
      console.error("Failed to open Bear note:", error);
    } else {
      console.log("Bear note created successfully!");
    }
  });
}
