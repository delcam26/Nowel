export type Personality = "dog" | "rabbit" | "dragon";

export interface PersonalityPoints {
  dog: number;
  rabbit: number;
  dragon: number;
}

export const initialPersonalityPoints: PersonalityPoints = {
  dog: 0,
  rabbit: 0,
  dragon: 0
};