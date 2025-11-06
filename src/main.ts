import "/style.css";
import { contacts, Contact ,Step , Choice , story , conversations} from "./data";
import { gameState, GameState } from "./gameState";
import { addMessage, showChoices, showTextInput, showTyping,showSystemMessage } from "./ui"; 

// --- Gestion du bouton retour ---
const backBtn = document.getElementById("back-btn") as HTMLButtonElement;
if (backBtn) {
  backBtn.addEventListener("click", () => {
    window.location.href = "/Nowel/menu.html ";
  });
}

// --- Mise à jour du titre du chat ---
const chatTitle = document.getElementById("chat-title");
const params = new URLSearchParams(window.location.search);
const convId = params.get("conv");

if (chatTitle && convId) {
  if (convId === "group") {
    chatTitle.textContent = "Groupe principal ";
  } else {
    const contact = contacts.find(c => c.id === convId);
    chatTitle.textContent = contact ? contact.name : "Conversation";
  }
}

const menuPage = document.getElementById("menu-page")!;
const chatPage = document.getElementById("chat-page")!;
const conversationList = document.getElementById("conversation-list")!;
const inputContainer = document.getElementById("input-container")!;

// --- afficher les conversations disponibles ---

export function showMenu() {
  menuPage.classList.add("active");
  chatPage.classList.remove("active");
  inputContainer.classList.add("hidden");
  conversationList.innerHTML = "";

  conversations.forEach(conv => {
    if (!conv.visible) return;
    const item = document.createElement("div");
    item.className = "conversation";
    item.innerHTML = `
      <img src="${conv.avatar}" alt="${conv.name}">
      <div class="conversation-name">${conv.name}</div>
    `;
    item.onclick = () => openChat(conv.id, conv.type);
    conversationList.appendChild(item);
  });
}

// --- Ouvrir une conversation ---
export function openChat(convId: string, type: "group" | "private") {
  menuPage.classList.remove("active");
  chatPage.classList.add("active");
  inputContainer.classList.remove("hidden");

  if (type === "group") {
    playStep("intro"); // scénario principal
  } else {
    // Conversation individuelle
    const contact = contacts.find(c => c.id === convId);
    if (contact) {
      const game = document.getElementById("game")!;
      game.innerHTML = ""; // vide le chat précédent
      const msg = document.createElement("div");
      msg.className = "system-message";
      msg.textContent = `Conversation privée avec ${contact.name} (en cours de développement 💬)`;
      game.appendChild(msg);
    }
  }
}

// --- Lancer le menu au démarrage ---
window.addEventListener("DOMContentLoaded", () => {
  showMenu();
});
// --- Enchainement des steps ---
export async function playStep(stepId: string) {
  await new Promise(r => setTimeout(r, 1000));
  const step = story.find(s => s.id === stepId);
  if (!step) return; //quitter si pas de step
  gameState.currentStep = step.id; //ou en est-on dans l'histoire
  const contact = contacts.find(c => c.id === step.contactId);
  if (!contact) return; //quitter si pas de contact

  //  Affichage du message (si présent) en prenant en compte les variables en fonciton du step
 if (step.message) {
    await showTyping(contact);
    console.log(" gameState avant affichage :", gameState);
    const message = step.message.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
      const k = key as keyof typeof gameState;
      return gameState[k]?.toString() || "";
    });
    addMessage(contact, message);
    console.log(" message final envoyé :", message);
  }
    // Gestion des entrées/sorties 
  if (step.action === "leave") {
    showSystemMessage(`${contact.name} a quitté la conversation.`);
    contact.active = false;
    return; 
  }
  if (step.action === "join") {
    showSystemMessage(`${contact.name} a rejoint la conversation.`);
    contact.active = true;
  }
  //  Gestion du type d’interaction
  if (step.inputType === "buttons" && step.choices) {
    showChoices(step.choices);
    return;
  }
  if (step.inputType === "text") {
    showTextInput(step);
    return;
  }
  //  Sinon, passe automatiquement au suivant
  if (step.nextStep) {
    playStep(step.nextStep);
  }
}

