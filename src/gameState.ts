export interface GameState {
  playerName: string;
  scores: Record<string, number>; // tes scores existants
  personalities: {
    dog: number;
    owl: number;
    dragon: number;
  };
  started: boolean;
  currentStep: string;  
  history: {
    contactId: string;
    message: string;
    type: "user" | "contact" | "system";
  }[];
}
export const gameState: GameState = {
  playerName: "",
  scores: {},
  personalities: {
    dog: 0,
    owl: 0,
    dragon: 0
  },
  started: false,
  currentStep: "intro_cosmo",
  history: []
};
