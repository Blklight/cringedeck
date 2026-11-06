import type { BlackCard } from "./types";

export interface Segment {
  text: string;
  filled: boolean;
}

export const BLANK_PATTERN = /_{3,}/;
const BLANK_DISPLAY = "____";

const stripEnd = (text: string) => text.replace(/[.!]+$/, "");

export const countBlanks = (text: string) =>
  text.split(BLANK_PATTERN).length - 1;

export function fillBlanks(black: BlackCard, answers: string[]): Segment[] {
  const parts = black.text.split(BLANK_PATTERN);
  if (parts.length === 1) {
    const out: Segment[] = [{ text: black.text, filled: false }];
    for (const answer of answers)
      out.push({ text: ` ${answer}`, filled: true });
    return out;
  }
  const out: Segment[] = [];
  parts.forEach((part, i) => {
    if (part) out.push({ text: part, filled: false });
    if (i < parts.length - 1) {
      const answer = answers[i];
      const atEnd = i === parts.length - 2 && parts[i + 1] === "";
      out.push(
        answer === undefined
          ? { text: BLANK_DISPLAY, filled: false }
          : { text: atEnd ? answer : stripEnd(answer), filled: true },
      );
    }
  });
  return out;
}
