//ui.ts
import { contacts, Contact ,Step , Choice , story } from "./data";
import { playStep } from "./main";
import { gameState } from "./gameState";
const game = document.getElementById("game") as HTMLElement;
const chat = document.getElementById("game") as HTMLDivElement
export function addMessage(contact: Contact | "user", text: string) {
  const message = document.createElement("div");
  message.className = "message";

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  if (contact === "user") {
    // message du joueur
    message.classList.add("user");
  } else {
    // message d’un contact
    const avatar = document.createElement("img");
    avatar.src = contact.avatar;
    avatar.alt = contact.name;
    avatar.className = "avatar";
    bubble.style.backgroundColor = contact.color || "#9b5de5";
    message.appendChild(avatar);
  }
  message.appendChild(bubble);
  game.appendChild(message);
  game.scrollTop = game.scrollHeight;
}

export function showMessage(from: Contact, text: string) {
  const messageDiv = document.createElement("div")
  messageDiv.className = "message"

  const avatar = document.createElement("img")
  avatar.src = from.avatar
  avatar.alt = from.name
  avatar.className = "avatar"

  const bubble = document.createElement("div")
  bubble.className = "bubble"
  bubble.style.backgroundColor = from.color
  bubble.textContent = text

  messageDiv.appendChild(avatar)
  messageDiv.appendChild(bubble)

  chat.appendChild(messageDiv)

  // Scroll automatique vers le bas
  chat.scrollTop = chat.scrollHeight
}

export function showChoices(choices: Choice[]) {
  const container = document.createElement("div");
  container.className = "choices";

  choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice.text;
    btn.onclick = () => {
      addMessage("user", choice.text);
      for (const [contactId, pts] of Object.entries(choice.points)) {
        const contact = contacts.find(c => c.id === contactId);
        if (contact) contact.score += pts;
      }
      container.remove();
      playStep(choice.nextStep);
    };
    container.appendChild(btn);
  });

  game.appendChild(container);
  game.scrollTop = game.scrollHeight;
}

export function showTextInput(step: Step) {
  const inputContainer = document.getElementById("input-container")!;
  const input = document.getElementById("user-input") as HTMLInputElement;
  const sendBtn = document.getElementById("send-btn") as HTMLButtonElement;
  inputContainer.classList.remove("hidden");
  input.focus();

  const handleSend = () => {
    const inputEl = document.getElementById("user-input") as HTMLInputElement;
    console.log("---- NOUVEL ENVOI ----");
    console.log("Événement déclenché à:", new Date().toLocaleTimeString());
    console.log("Élément input trouvé:", inputEl);
    console.log("Valeur de inputEl.value juste avant trim:", inputEl.value);
    const text = inputEl.value.trim();
    console.log("Valeur après trim:", text);  
    if (text !== "") {
      addMessage("user", text);
      input.value = "";
      inputContainer.classList.add("hidden");

      sendBtn.removeEventListener("click", handleSend);
      input.removeEventListener("keydown", handleKeyDown);

      if (step.id === "ask_name") {
        gameState.playerName = text;
        console.log("Nom enregistré dans gameState:", gameState.playerName);
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
  game.appendChild(message);
  game.scrollTop = game.scrollHeight;
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
    game.appendChild(typing);
    game.scrollTop = game.scrollHeight;

    setTimeout(() => {
      typing.remove();
      resolve();
    }, duration);
  });
}
