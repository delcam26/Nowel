import "/style.css";
import { contacts, Contact ,Step , Choice , story , conversations} from "./data";
import { gameState, GameState } from "./gameState";
import { addMessage, showChoices, showTextInput, showTyping,showSystemMessage,getDominantPersonality,shuffleArray } from "./ui"; 

// --- Mise à jour du titre du chat ---
const chatTitle = document.getElementById("chat-title");
const params = new URLSearchParams(window.location.search);
let convId = params.get("conv");
const menuPage = document.getElementById("menu-page")!;
const chatPage = document.getElementById("chat-page")!;
const conversationList = document.getElementById("conversation-list")!;
const inputContainer = document.getElementById("input-container")!;


window.addEventListener("beforeunload", () => {
  localStorage.setItem("gameState", JSON.stringify(gameState));
});

// --- Afficher la liste des conversations
export function showMenu() {
  if (chatTitle && convId) {
    if (convId === "group") {
      chatTitle.textContent = "Quel sera ton cadeau de noël ? ";
    } else {
      const contact = contacts.find(c => c.id === convId);
      chatTitle.textContent = contact ? contact.name : "Conversation";
    }
  }
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
    ${conv.unread ? `<span class="badge">${conv.unread}</span>` : ""}
  `;
  item.onclick = () => openChat(conv.id, conv.type);
  conversationList.appendChild(item);
  });
}

// --- Ouvrir un détail de contact ---
export function showContactDetails(contactId: string) {
  const game = document.getElementById("game")!;
  game.innerHTML = ""; // on vide le contenu actuel

  const contact = contacts.find(c => c.id === contactId);
  if (!contact) return;

  // --- Avatar et nom ---
  const header = document.createElement("div");
  header.className = "contact-header";

 const name = document.createElement("h2");
  name.textContent = contact.name;

  const avatar = document.createElement("img");
  avatar.src = contact.avatar;
  avatar.alt = contact.name;
  avatar.className = "contact-avatar";

  header.appendChild(name);
  header.appendChild(avatar);
  game.appendChild(header);

  // --- Score / affinité ---
  const score = document.createElement("div");
  score.className = "contact-score";
  const points = gameState.scores[contact.id] || 0;
  game.appendChild(score);

  // --- Description / bio ---
  const bio = document.createElement("p");
  bio.textContent = contact.bio || "Ce personnage est encore un mystère...";
  game.appendChild(bio);

  // --- Bouton retour ---
  const backBtn = document.createElement("button");
  backBtn.textContent = " Retour à la conversation";
  backBtn.className = "back-btn";
  backBtn.onclick = () => openChat(contactId,"private"); // revenir dans le chat
  game.appendChild(backBtn);
}
// --- Lancer le menu au démarrage ---
window.addEventListener("DOMContentLoaded", () => {
  showMenu();
});

// --- Ouvrir une conversation ---
export async function openChat(chatId: string, type: "group" | "private") {
  convId = chatId;
  const conv = conversations.find(c => c.id === chatId);
  if (conv) conv.unread = 0; // réinitialise la pastille
  // Masquer le menu, afficher le chat
  menuPage.classList.remove("active");
  chatPage.classList.add("active");
  inputContainer.classList.remove("hidden");

  const gameDiv = document.getElementById("game")!;
  gameDiv.innerHTML = ""; // On vide l'affichage, pas l'historique

  // --- Recharger l'état sauvegardé si existant --- pour linsant ça bug
  //const saved = localStorage.getItem("gameState");
  //if (saved) Object.assign(gameState, JSON.parse(saved));

  // --- Afficher l'historique ---
  //for (const msg of gameState.history) {
  //  if (msg.type === "user") {
  //    addMessage("user", msg.message, true);
  //  } else {
  //    const contact = contacts.find(c => c.id === msg.contactId);
   //   if (contact) addMessage(contact, msg.message, false);
    //}
  //}

  // --- Déterminer si c'est un chat de groupe ou privé ---
  if (type === "group") {
    // Step en cours
    const step = story.find(s => s.id === gameState.currentSteps[chatId]);
    if (!step) return;

    // Afficher le step courant
    await playStep(step.id, { replay: true });

  } else {
    // Conversation individuelle
    const contact = contacts.find(c => c.id === convId);
    if (!contact) return;

    const contactsBtn = document.createElement("button");
    contactsBtn.textContent = "Info contact";
    contactsBtn.className = "contacts-btn";
    contactsBtn.onclick = () => showContactDetails(contact.id);
    gameDiv.appendChild(contactsBtn);

    const msg = document.createElement("div");
    msg.className = "system-message";
    msg.textContent = `Conversation privée avec ${contact.name} (en cours de développement 💬)`;
    gameDiv.appendChild(msg);
  }
}
// --- Enchainement des steps ---
export async function playStep(stepId: string, options?: { replay?: boolean }) {
  if (!convId) return;
  const chatStepId =
  stepId ??
  gameState.currentSteps[convId]; // convId = chat actif

const step = story.find(s => s.id === chatStepId);
if (!step) return;

// on sauvegarde le step courant pour CE chat
gameState.currentSteps[convId] = step.id;
console.log("PLAY STEP:" , gameState.currentSteps[convId]);
if (!step) return;
  const contact = contacts.find(c => c.id === step.contactId);
  if (!contact) return;

  // Affichage du message si présent (avec le nom du joueur si besoin)
  if (step.message) {
    if (!options?.replay) await showTyping(contact);
    const message = step.message.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
      const k = key as keyof typeof gameState;
      return gameState[k]?.toString() || "";
    });

    addMessage({ type: "contact", contact }, message);
  }

  // Actions join/leave
  if (step.action === "leave") {
    showSystemMessage(`${contact.name} a quitté la conversation.`);
    contact.active = false;
  }
  if (step.action === "join") {
    showSystemMessage(`${contact.name} a rejoint la conversation.`);
    contact.active = true;
  }

  // Gestion du type d'interaction
  if (step.inputType === "buttons" && step.choices) {
     const randomChoices = shuffleArray(step.choices);
     showChoices(randomChoices);
    return; // Attente de la réponse de l'utilisateur
  }

  if (step.inputType === "text") {
    showTextInput(step);
    return; // Attente de l'utilisateur
  }

  // Sinon, step suivant automatique
  if (step.nextStep) {
    await playStep(step.nextStep);
  }
}

// --- Gestion du bouton retour ---
const backBtn = document.getElementById("back-btn") as HTMLButtonElement;
if (backBtn) {
  backBtn.addEventListener("click", () => {
    window.location.href = "/Nowel/menu.html ";
  });
}