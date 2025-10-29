export interface Contact {
  id: string
  name: string
  avatar: string
  color: string
  score:number
  active?:boolean
}
export interface Step {
  id: string;
  contactId: string;
  message?: string;
  inputType?: "buttons" | "text";
  choices?: Choice[];
  nextStep?: string;
  action?: "leave" | "join";
  actionOrder?: "before" | "after"; 
}

export interface Choice {
  text: string;
  points: { [contactId: string]: number };
  nextStep: string;
}

export const contacts: Contact[] = [
  {
    id: "cosmo",
    name: "Cosmo",
    avatar: "./assets/images/cosmo.jpg",
    color: "#9b5de5",
    score:0
  },
    {
    id: "blaaj",
    name: "blaaj",
    avatar: "./assets/images/requin.jpg",
    color: "#94bfe4ff",
    score:0
  }
]
export type ConversationType = "group" | "private";

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  type: ConversationType;
}

export const conversations: Conversation[] = [
  {
    id: "group",
    name: "Groupe principal 💬",
    avatar: "./assets/images/group.jpg",
    type: "group",
  },
  ...contacts.map(c => ({
    id: c.id,
    name: c.name,
    avatar: c.avatar,
    type: "private" as const, // <— important !
  })),
];


export const story: Step[] = [
  {
    id: "intro",
    contactId: "cosmo",
    message: "Hey ! Tu veux aider à sauver Noël ? 🎄",
    inputType: "buttons",
    choices: [
      {
        text: "Évidemment !",
        points: { cosmo: 2 },
        nextStep: "ask_name"
      },
      {
        text: "Hmm... pourquoi faire ?",
        points: { cosmo : -1 },
        nextStep: "endgame"
      }
    ]
  },
  {
    id: "ask_name",
    contactId: "cosmo",
    message: "Super ! Et comment tu t’appelles, héros ?",
    inputType: "text", 
    nextStep: "croc_blaaj"
  },
    {
    id: "endgame",
    contactId: "cosmo",
    message: "OK...si c'est comme ça alors salut !",
    action: "leave",
  }
  ,
{
    id: "croc_blaaj",
    contactId: "blaaj",
    message: "Ca a l'air bon ça du {{playerName}}, j'en ferais bien mon 4h",
    nextStep: "cosmo_cute",
    action: "join"
  },
  {
    id: "cosmo_cute",
    contactId: "cosmo",
    action: "leave",
    message: "Je ne l'avais pas invité celui-là .."
  }
];
