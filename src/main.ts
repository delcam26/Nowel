import "/style.css";
import { contacts, Contact ,Step , Choice , story } from "./data";
import { GameState,gameState } from "./gameState";
import { addMessage, showChoices, showTextInput, showTyping,showSystemMessage } from "./ui"; 


const input = document.querySelector(".input-bar input") as HTMLInputElement;
const sendBtn = document.querySelector(".input-bar button") as HTMLButtonElement;
// initialiser le step
let currentStepId = "intro";
// Fonction pour afficher un message 


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
export async function playStep(stepId: string) {
  const step = story.find(s => s.id === stepId);
  if (!step) return;

  gameState.currentStep = step.id;

  const contact = contacts.find(c => c.id === step.contactId)!;
  if (!contact) return;

  //  Si le step contient un message classique
  if (step.message) {
    await showTyping(contact);
    const message = step.message.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const k = key as keyof GameState;
  return gameState[k] as string || "";
});
    addMessage(contact, message);
  }

  if (step.inputType === "buttons" && step.choices) {
    showChoices(step.choices);
  } else if (step.inputType === "text") {
    showTextInput(step);
  } else if (step.nextStep) {
    playStep(step.nextStep);
  }

    // Connecter et deconnecter les contacts
  if (step.action === "leave") {
    showSystemMessage(`${contact.name} a quitté la conversation.`);
    contact.active = false; // si tu veux le masquer ensuite
  } else if (step.action === "join") {
    showSystemMessage(`${contact.name} a rejoint la conversation.`);
    contact.active = true;
  }
}


