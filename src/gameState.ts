export interface GameState {
  playerName: string;
  scores: Record<string, number>;
  personalities: {
    dog: number;
    rabbit: number;
    dragon: number;
  };
  started: boolean;

  currentSteps: Record<string, string>; //  step par chatId sous forme de map et plus de string

  history: {
    chatId: string;
    contactId?: string;
    message: string;
    type: "user" | "contact" | "system";
  }[];
}
export const gameState: GameState = {
  playerName: "",
  scores: {},
  personalities: {
    dog: 0,
    rabbit: 0,
    dragon: 0
  },
  started: false,
  currentSteps: {
    group: "intro_cosmo" 
  },
  history: []
};