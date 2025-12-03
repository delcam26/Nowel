export type Personality = "dog" | "owl" | "dragon";

export interface PersonalityPoints {
  dog: number;
  owl: number;
  dragon: number;
}

export const initialPersonalityPoints: PersonalityPoints = {
  dog: 0,
  owl: 0,
  dragon: 0
};
export const avatarDog = [
  { min: 5, asset: "dog_ears.png" },
  { min: 10, asset: "dog_ears_nose.png" },
  { min: 30, asset: "dog_full.png" }
];
export const avatarOwl = [
  { min: 5, asset: "owl_ears.png" },
  { min: 10, asset: "owl_ears_nose.png" },
  { min: 30, asset: "owl_full.png" }
];
export const avatarDragon = [
  { min: 5, asset: "dragon_ears.png" },
  { min: 10, asset: "dragon_ears_nose.png" },
  { min: 30, asset: "dragon_full.png" }
];