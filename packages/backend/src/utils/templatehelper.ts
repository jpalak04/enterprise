import * as Handlebars from 'handlebars';
import * as fs from 'fs/promises';

interface Replacements {
  [key: string]: string;
}

export async function applyTemplateFromFile(filePath: string, replacements: Replacements): Promise<string> {
  const content = await fs.readFile(filePath, 'utf-8');
  return applyTemplate(content, replacements);
}

export function applyTemplate(content: string, replacements: Replacements): string {
  const template = Handlebars.compile(content);
  return template(replacements);
}
