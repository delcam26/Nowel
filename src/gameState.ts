export interface GameState {
  playerName: string;
  scores: Record<string, number>; // un score par contact
  currentStep: string;            // étape actuelle du scénario
  history: { contactId: string; message: string }[]; // messages échangés
}

export const gameState: GameState = {
  playerName: "",
  scores: {},
  currentStep: "intro",
  history: []
};