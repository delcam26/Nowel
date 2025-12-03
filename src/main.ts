import "/style.css";
import { contacts, Contact ,Step , Choice , story , conversations} from "./data";
import { gameState, GameState } from "./gameState";
import { addMessage, showChoices, showTextInput, showTyping,showSystemMessage,resetGameState } from "./ui"; 

// --- Mise à jour du titre du chat ---
const chatTitle = document.getElementById("chat-title");
const params = new URLSearchParams(window.location.search);
const convId = params.get("conv");
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
  score.textContent = `❤️ ${points} points d'affinité`;
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
export function openChat(convId: string, type: "group" | "private") {
  menuPage.classList.remove("active");
  chatPage.classList.add("active");
  inputContainer.classList.remove("hidden");
  const game = document.getElementById("game")!;
  game.innerHTML = "";

  if (type === "group") {
    // Restaurer l’historique
    console.log("gameState au chargement de la page:", gameState);
    console.log(gameState.history);
    
  //recuperer l'historique
  const saved = localStorage.getItem("gameState");
  if (saved) Object.assign(gameState, JSON.parse(saved));

    for (const msg of gameState.history) {
  if (msg.contactId === "user") {
    addMessage("user", msg.message, true);
  } else {
    const contact = contacts.find(c => c.id === msg.contactId);
    if (contact) addMessage(contact, msg.message, false);
  }
}

    // Ne lancer le scénario qu'une seule fois
    if (!gameState.started) {
      gameState.started = true;
      playStep("intro_cosmo");
     } else {
      // Relancer le step en cours
      const step = story.find(s => s.id === gameState.currentStep);
      if (step?.inputType === "buttons" && step.choices) {
        showChoices(step.choices);
      } else if (step?.inputType === "text") {
        showTextInput(step);
      }
    }
  } else {
    //  Conversation individuelle
    const contact = contacts.find(c => c.id === convId);
    if (contact) {
      const contactsBtn = document.createElement("button");
      contactsBtn.textContent = "Info contact";
      contactsBtn.className = "contacts-btn";
      contactsBtn.onclick = () => showContactDetails(contact.id);
      game.appendChild(contactsBtn);

      const msg = document.createElement("div");
      msg.className = "system-message";
      msg.textContent = `Conversation privée avec ${contact.name} (en cours de développement )`;
      game.appendChild(msg);
    }
  }
}
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
   console.log("Message à afficher");
    await showTyping(contact);
    console.log(" gameState avant affichage :", gameState);
    const message = step.message.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
      const k = key as keyof typeof gameState;
      return gameState[k]?.toString() || "";
    });
    addMessage(contact, message);
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

// --- Gestion du bouton retour ---
const backBtn = document.getElementById("back-btn") as HTMLButtonElement;
if (backBtn) {
  backBtn.addEventListener("click", () => {
    window.location.href = "/Nowel/menu.html ";
  });
}