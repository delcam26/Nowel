export interface Contact {
  id: string
  name: string
  avatar: string
  color: string
  messages: string[]
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
  action?: "leave" | "join"; // 👈 nouveau
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
    messages: [
      "Hey 👋 c’est moi, Cosmo !",
      "Prêt pour ton aventure de Noël ? 🎄"
    ],
    score:0

  },
    {
    id: "blaaj",
    name: "blaaj",
    avatar: "./assets/images/requin.jpg",
    color: "#94bfe4ff",
    messages: [
      "Y a quoi à manger par ici ?",
      "J'y crois pas, elle me fait parler dans son jeu stupide ta femelle ? "
    ],
    score:0
  }
]
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
        points: { data: 1 },
        nextStep: "endgame"
      }
    ]
  },
  {
    id: "ask_name",
    contactId: "cosmo",
    message: "Super ! Et comment tu t’appelles, héros ?",
    inputType: "text", 
    nextStep: "entree_blaaj"
  },
    {
    id: "endgame",
    contactId: "cosmo",
    message: "OK...si c'est comme ça alors salut !",
    action: "leave",
  }
  ,
{
    id: "entree_blaaj",
    contactId: "blaaj",
    action: "join",
    nextStep: "croc_blaaj"
  },
{
    id: "croc_blaaj",
    contactId: "blaaj",
    message: "ça a l'air bon ça du {{playerName}}, j'en ferais bien mon 4h",
    nextStep: "cosmo_cute"
  },
  {
    id: "cosmo_cute",
    contactId: "cosmo",
    action: "leave",
  }
];
