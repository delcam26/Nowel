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
  },
  {
    id: "user",
    name: gameState.playerName || "Moi",
    avatar: "./assets/images/icone_origine.png",
    color: "#d0d0d0",
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
    action: "join",
    actionOrder: "before",
    message: "Salut toi ! Je t'ai rajouté à la conversation de groupe pour que tu ait les infos concernant la fête de ce soir",
    nextStep: "intro_blaaj",
  },
 {
    id: "intro_blaaj",
    contactId: "blaaj",
    message: "C'est qui lui ?",
    inputType: "text",
    action: "join",
    actionOrder: "before",
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
  },
  {
    id: "A1_bambi",
    contactId:"cosmo",
    message: "J'ai pas l'adresse tu te doutes ... je crois que j'ai vu un panneau 'Bambie chie'",
    inputType: "buttons",
    choices: [
      {
        text: "Donne-moi l’adresse, j’arrive à la rescousse !",
        personalityPoints: { dog: 1 },
        nextStep: "2_sauvee"
      },
      {
        text: "Envoie une photo, j'aime bien les défis",
        personalityPoints: { owl: 1 },
        nextStep: "2_sauvee"
      },
      {
        text: "Attend qu'il ait fini de chier j'imagine ?",
        personalityPoints: { dragon: 1 },
        nextStep: "2_sauvee"
      }
    ]
  },
    {
    id: "B1_human_approaches",
    contactId:"cosmo",
    message: "Je l'ai reveillée en cherchant la sortie, elle s'approche de moi ...",
    inputType: "buttons",
    choices: [
      {
        text: "Continue à te cacher le temps que j'arrives .. Tu me fais flipper.",
        personalityPoints: { dog: 1 },
        nextStep: "2_sauvee"
      },
      {
        text: "Reste tranquille et fait lui tes plus beaux yeux tristes pour l'attendrir.",
        personalityPoints: { owl: 1 },
        nextStep: "2_sauvee"
      },
      {
        text: "T'inquiète, ils te mangeront pas, y parait que c'est comme ça que le covid a commencé.",
        personalityPoints: { dragon: 1 },
        nextStep: "2_sauvee"
      }
    ]
  },
    {
    id: "C1_flirt",
    contactId:"cosmo",
    message: "Tu sais bien que tu peux déjà tout me demander ... /blush/",
    inputType: "buttons",
    nextStep: " B1_blaaj_cant_wait"
  },
      {
    id: "B1_blaaj_cant_wait",
    contactId:"blaaj",
    message: "Ca suffit les niaiseries, on y va sans elle !",
    inputType: "buttons",
        choices: [
      {
        text: "Parle pour toi, viens en privé Cosmo ...",
        personalityPoints: { dog: 1 },
        nextStep: "2_sauvee"
      },
      {
        text: "Pas faux ... je dois amener l'apéro je ne peux pas à arriver trop en retard",
        personalityPoints: { owl: 1 },
        nextStep: "2_sauvee"
      },
      {
        text: "Chut blaaj, la conversation commençait tout juste à m'intéresser..",
        personalityPoints: { dragon: 1 },
        nextStep: "2_sauvee"
      }
    ]
  },
     {
    id: "2_sauvee",
    contactId:"cosmo",
    message: "C'est bon une autre dame est venue me jeter dehors, j'arrive les gars.{{playerName}} tu veux que je t'accompagne à la soirée ou on se renjoint là bas ? ",
    inputType: "buttons",
        choices: [
      {
        text: "Comme ça t'arrange",
        personalityPoints: { dog: 1 },
        nextStep: "go_prive"
      },
      {
        text: "On va perdre du temps si on se cherche, je viens directement ! ",
        personalityPoints: { owl: 1 },
        nextStep: "go_prive"
      },
      {
        text: "Je suis partant pour arriver à ton bras ! Ou à ton aile ...",
        personalityPoints: { dragon: 1 },
        nextStep: "go_prive"
      }
    ]
  }


];