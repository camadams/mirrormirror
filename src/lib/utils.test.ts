import { Character } from "./types";
import { calculateWinner } from "./utils";
import { describe, it, expect } from "@jest/globals";

describe("calculateWinner", () => {
  it("should return 0 when first character wins more attribute comparisons", () => {
    const char1: Character = {
      name: "Mickey Mouse",
      films: ["Film 1", "Film 2", "Film 3"],
      tvShows: ["Show 1", "Show 2"],
      videoGames: ["Game 1", "Game 2"],
      parkAttractions: ["Attraction 1", "Attraction 2"],
    };

    const char2: Character = {
      name: "Donald Duck",
      films: ["Film 1"],
      tvShows: [],
      videoGames: [],
      parkAttractions: ["Attraction 1"],
    };

    expect(calculateWinner(char1, char2)).toBe(0);
  });

  it("should return 1 when second character wins more attribute comparisons", () => {
    const char1: Character = {
      name: "Mickey Mouse",
      films: ["Film 1"],
      tvShows: [],
      videoGames: ["Game 1"],
      parkAttractions: [],
    };

    const char2: Character = {
      name: "Donald Duck",
      films: ["Film 1", "Film 2"],
      tvShows: ["Show 1", "Show 2"],
      videoGames: ["Game 1", "Game 2"],
      parkAttractions: ["Attraction 1"],
    };

    expect(calculateWinner(char1, char2)).toBe(1);
  });

  it("should handle characters with empty or undefined arrays", () => {
    const char1: Character = {
      name: "Mickey Mouse",
      films: [],
      tvShows: [],
      videoGames: [],
      parkAttractions: [],
    };

    const char2: Character = {
      name: "Donald Duck",
      films: [],
      tvShows: ["Show 1"],
      videoGames: [],
      parkAttractions: ["Attraction 1"],
    };

    expect(calculateWinner(char1, char2)).toBe(1);
  });

  it("should return -1 when characters have equal attribute wins", () => {
    // Character 1 wins on Motion Diversity and Motion Appearances
    // Character 2 wins on Likeability and Park Appearances
    const char1: Character = {
      name: "Mickey Mouse",
      films: ["Film 1", "Film 2"],
      tvShows: ["Show 1", "Show 2"],
      videoGames: ["Game 1"],
      parkAttractions: [],
      // Give character 1 more enemies than allies to lower likeability
      allies: ["Ally 1"],
      enemies: ["Enemy 1", "Enemy 2", "Enemy 3"],
    };

    const char2: Character = {
      name: "Donald Duck",
      films: ["Film 1"],
      tvShows: [],
      videoGames: [],
      parkAttractions: ["Attraction 1", "Attraction 2"],
      // Give character 2 more allies than enemies to raise likeability
      allies: ["Ally 1", "Ally 2", "Ally 3"],
      enemies: ["Enemy 1"],
    };

    expect(calculateWinner(char1, char2)).toBe(-1);
  });
});
