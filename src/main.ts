import "/style.css";
import { contacts, Contact ,Step , Choice , story } from "./data";

const game = document.getElementById("game") as HTMLElement;
const input = document.querySelector(".input-bar input") as HTMLInputElement;
const sendBtn = document.querySelector(".input-bar button") as HTMLButtonElement;
// initialiser le step et les etats des contacts
let currentStepId = "intro";
const gameState: { [key: string]: string } = {};

// Fonction pour afficher un message 
function addMessage(contact: Contact | "user", text: string) {
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

// Fonction d’envoi
function sendMessage() {
  const text = input.value.trim();
  if (text === "") return;
  addMessage("user",text);
  input.value = "";
}

// --- Événements ---
sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
window.addEventListener("DOMContentLoaded", () => {
  playStep(currentStepId);
});

// --- Enchainement des steps ---
async function playStep(stepId: string) {
  const step = story.find(s => s.id === stepId);
  if (!step) return;

  const contact = contacts.find(c => c.id === step.contactId)!;

  // 💬 Si le step contient un message classique
  if (step.message) {
    await showTyping(contact);
    let message = step.message.replace(/\{\{(\w+)\}\}/g, (_, key) => gameState[key] || "");
    message = message.replace(/\{\{(\w+)\}\}/g, (_, key) => gameState[key] || "");
    addMessage(contact, message);
  }

  // 🧨 Gérer les actions spéciales
  if (step.action === "leave") {
    showSystemMessage(`${contact.name} a quitté la conversation.`);
    contact.active = false; // si tu veux le masquer ensuite
  } else if (step.action === "join") {
    showSystemMessage(`${contact.name} a rejoint la conversation.`);
    contact.active = true;
  }

  // 🔁 Suite du scénario
  if (step.choices) {
    showChoices(step.choices);
  } else if (step.inputType === "text") {
    showTextInput(step);
  } else if (step.nextStep) {
    playStep(step.nextStep);
  }
}

function showChoices(choices: Choice[]) {
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
function showTextInput(step: Step) {
  const inputContainer = document.getElementById("input-container")!;
  inputContainer.classList.remove("hidden");

  const input = document.getElementById("user-input") as HTMLInputElement;
  const sendBtn = document.getElementById("send-btn") as HTMLButtonElement;

  const handleSend = () => {
    const text = input.value.trim();
    if (text) {
      addMessage("user", text);
      input.value = "";
      inputContainer.classList.add("hidden");
      sendBtn.removeEventListener("click", handleSend);

      // 💾 On stocke la valeur pour plus tard
      gameState["playerName"] = text;

      playStep(step.nextStep!);
    }
  };
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault(); // empêche le saut de ligne
      handleSend();
    }
  };

  sendBtn.addEventListener("click", handleSend);
  input.addEventListener("keydown", handleKeyDown);
}

function showSystemMessage(text: string) {
  const message = document.createElement("div");
  message.className = "system-message";
  message.textContent = text;
  game.appendChild(message);
  game.scrollTop = game.scrollHeight;
}

function showTyping(contact: Contact, duration = 1500): Promise<void> {
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