
const game = document.getElementById("game") as HTMLElement;
import "/style.css";
import { contacts, Contact } from "./data";

export function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // enlève accents
    .replace(/[^\w\s]/g, "") // enlève ponctuations
    .trim();
}

export function isAnswerCorrect(input: string, expected: string[]) {
  const n = normalize(input);
  return expected.some(e => n.includes(normalize(e)));
}

