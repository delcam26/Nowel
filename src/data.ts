import { gameState, GameState } from "./gameState";
export interface Contact {
  id: string
  name: string
  avatar: string
  color: string
  bio: string
  active?: boolean
  visible: boolean
}
export interface Step {
  id: string;
  contactId:String;
  message?: string;
  inputType?: "buttons" | "text";
  choices?: Choice[];
  nextStep?: string;
  action?: "leave" | "join";
  actionOrder?: "before" | "after"; 
}

export interface Choice {
  text: string;
  nextStep: string;
  personalityPoints?: Partial<GameState["personalities"]>;
}

export const contacts: Contact[] = [
  {
    id: "cosmo",
    name: "Cosmo",
    avatar: "./assets/images/cosmo.jpg",
    color: "#9b5de5",
    bio: "blahblahblah",
    visible: true ,
  },
    {
    id: "blaaj",
    name: "blaaj",
    avatar: "./assets/images/requin.jpg",
    color: "#94bfe4ff",
    bio: "blahblahblah",
    visible:false,
  }
]
export type ConversationType = "group" | "private";

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  type: ConversationType;
 visible: boolean;
}

export const conversations: Conversation[] = [
  {
    id: "group",
    name: "Groupe principal 💬",
    avatar: "./assets/images/group.jpg",
    type: "group",
     visible: true,
  },
  ...contacts.map(c => ({
    id: c.id,
    name: c.name,
    avatar: c.avatar,
    type: "private" as const, // <— important !
    visible: c.visible
  })),
];

export const story: Step[] = [
  {
    id: "intro_cosmo",
    contactId: "cosmo",
    message: "Salut toi ! Je t'ai rajouté à la conversation de groupe pour que tu ait les infos concernant la fête de ce soir",
    nextStep: "intro_blahj",
  },

 {
    id: "intro_blahj",
    contactId: "blahj",
    message: "C'est qui lui ?",
    inputType: "text",
    action: "join",
    nextStep: "croc_blaaj",
  },
{
    id: "croc_blaaj",
    contactId: "blaaj",
    message: "Ca a l'air bon ça du {{playerName}}, j'en ferais bien mon 4h",
    nextStep: "stuck_house",
  },

  // --- DÉBUT DE TON HISTOIRE COSMO BLOQUÉ ---
  {
    id: "stuck_house",
    contactId:"cosmo",
    message: "Je suis rentrée par erreur chez une humaine… et elle a fermé la fenêtre derrière moi ! 😰 Je fais quoi ?",
    inputType: "buttons",
    choices: [
      {
        text: "Donne-moi l’adresse, j’arrive à la rescousse !",
        personalityPoints: { dog: 1 },
        nextStep: "A1_bambi"
      },
      {
        text: "Elle dort ? Si oui attends demain sinon cage directe.",
        personalityPoints: { owl: 1 },
        nextStep: "B1_human_approaches"
      },
      {
        text: "Si je viens t’aider… tu me rends un petit service ? 😏",
        personalityPoints: { dragon: 1 },
        nextStep: "C1_flirt"
      }
    ]
  }


];