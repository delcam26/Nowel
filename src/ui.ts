//ui.ts
import { contacts, Contact ,Step , Choice , story } from "./data";
import { playStep,showContactDetails } from "./main";
import { GameState,gameState } from "./gameState";
import { Personality,PersonalityPoints } from "./personnality";
type MessageAuthor =
  | { type: "user" }
  | { type: "system" }
  | { type: "contact"; contact: Contact };

const chat = document.getElementById("game") as HTMLElement;

export function addMessage(
  author: MessageAuthor,
  text: string,
  save = true
) {
  //console.log("addMessage appelé :", author, text);
  const message = document.createElement("div");
  message.classList.add("message");

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  if (author.type === "user") {
    message.classList.add("user");
    const avatar = document.createElement("img");
    avatar.className = "avatar";
    const dominant =getDominantPersonality (gameState.personalities);
    if (dominant === null) {
      avatar.src = "./assets/images/icone_origine.png";
      console.log("Aucune personnalité dominante");
    }
    else {
    const niveau = getLevel (dominant);
    avatar.src = "./assets/images/"+dominant+niveau+".png";  //+ au lieu de , sinon y a un espace auto
    console.log ("Personnalité dominante : "+dominant+niveau+".png");
  }

    message.appendChild(avatar);
    message.appendChild(bubble);

  } else if (author.type === "system") {
    message.classList.add("system-message");
    message.appendChild(bubble);

  } else {
    const { contact } = author;

    const avatar = document.createElement("img");
    avatar.src = contact.avatar;
    avatar.alt = contact.name;
    avatar.className = "avatar";

    bubble.style.backgroundColor = contact.color;

    message.appendChild(avatar);
    message.appendChild(bubble);
  }

  chat.appendChild(message);

  requestAnimationFrame(() => {
    chat.scrollTop = chat.scrollHeight;
  });
}
export function applyPersonalityPoints(
  pts: Partial<GameState["personalities"]>,
  state: GameState
) {
  Object.entries(pts).forEach(([key, value]) => {
    state.personalities[key as keyof GameState["personalities"]] += value!;
  });
}
export function getDominantPersonality(
  points: PersonalityPoints
): Personality | null {
  const entries = Object.entries(points) as [Personality, number][];

  // Trouver le score maximal
  const maxValue = Math.max(...entries.map(([_, value]) => value));

  // Toutes les personnalités qui ont ce score maximal
  const topPersonalities = entries
    .filter(([_, value]) => value === maxValue)
    .map(([key]) => key);

  // Si plusieurs ont le même score, il n'y a pas de dominante
  if (topPersonalities.length !== 1) return null;

  return topPersonalities[0];
}
export function getLevel(personnality: Personality): number {
  const score = gameState.personalities[personnality];
  if (score == 1) return 1;
  if (score <=2 && score >1) return  2;
  if (score > 2) return 3;
  return 0;
}
export function showChoices(choices: Choice[]) {
  const container = document.createElement("div");
  container.className = "choices";

  choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice.text;

    btn.onclick = () => {
      if (choice.personalityPoints) {
        applyPersonalityPoints(choice.personalityPoints, gameState);
        //loger les pts et la personnalité dominante
        console.log("Les points sont :",gameState.personalities);
        console.log ("Personnalité dominante : ",getDominantPersonality(gameState.personalities));
      }
      addMessage({ type: "user"}, choice.text);

      container.remove();
      playStep(choice.nextStep);
    };

    container.appendChild(btn);
  });

  chat.appendChild(container);
  requestAnimationFrame(() => {
  chat.scrollTop = chat.scrollHeight;
  //console.log("scrollTop:", chat.scrollTop, "/", chat.scrollHeight);

})
}
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]; // copier pour ne pas muter l'original
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
export function showTextInput(step: Step) {
  const inputContainer = document.getElementById("input-container")!;
  const input = document.getElementById("user-input") as HTMLInputElement;
  const sendBtn = document.getElementById("send-btn") as HTMLButtonElement;
  inputContainer.classList.remove("hidden");
  input.focus();

  const handleSend = () => {
    const inputEl = document.getElementById("user-input") as HTMLInputElement;
    const text = inputEl.value.trim(); 
    if (text !== "") {
      addMessage({ type: "user" }!, text);
      input.value = "";
      inputContainer.classList.add("hidden");

      sendBtn.removeEventListener("click", handleSend);
      input.removeEventListener("keydown", handleKeyDown);

      if (step.id === "intro_blaaj") {
        gameState.playerName = text;
        //console.log("Nom enregistré dans gameState:", gameState.playerName);
      }

      if (step.nextStep) {
        playStep(step.nextStep);
      } else {
        console.warn(`Pas de nextStep défini pour ${step.id}`);
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  sendBtn.addEventListener("click", handleSend);
  input.addEventListener("keydown", handleKeyDown);
}
export function showSystemMessage(text: string) {
  const message = document.createElement("div");
  message.className = "system-message";
  message.textContent = text;
  chat.appendChild(message);
  requestAnimationFrame(() => {
  chat.scrollTop = chat.scrollHeight
})
}
export function showTyping(contact: Contact, duration = 200): Promise<void> {
  return new Promise((resolve) => {
    const typing = document.createElement("div");
    typing.className = "message typing";

    const avatar = document.createElement("img");
    avatar.src = contact.avatar;
    avatar.alt = contact.name;
    avatar.className = "avatar";

    const bubble = document.createElement("div");
    bubble.className = "bubble typing-bubble";
    bubble.style.backgroundColor = contact.color;
    bubble.textContent = "•••"; // petits points

    typing.appendChild(avatar);
    typing.appendChild(bubble);
    chat.appendChild(typing);
    chat.scrollTop = chat.scrollHeight;

    setTimeout(() => {
      typing.remove();
      resolve();
    }, duration);
  });
}
