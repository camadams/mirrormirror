import { Character } from "./types";
import { calculateWinner } from "./utils";
import { describe, it, expect } from "@jest/globals";

describe("calculateWinner", () => {
  it("should return 0 when first character has more appearances", () => {
    const char1: Character = {
      name: "Mickey Mouse",
      films: ["Film 1", "Film 2", "Film 3"],
      tvShows: ["Show 1", "Show 2"],
    };

    const char2: Character = {
      name: "Donald Duck",
      films: ["Film 1"],
    };

    expect(calculateWinner(char1, char2)).toBe(0);
  });

  it("should return 1 when second character has more appearances", () => {
    const char1: Character = {
      name: "Mickey Mouse",
      films: ["Film 1"],
    };

    const char2: Character = {
      name: "Donald Duck",
      films: ["Film 1", "Film 2"],
      tvShows: ["Show 1", "Show 2"],
    };

    expect(calculateWinner(char1, char2)).toBe(1);
  });

  it("should handle characters with empty or undefined arrays", () => {
    const char1: Character = {
      name: "Mickey Mouse",
      films: [],
    };

    const char2: Character = {
      name: "Donald Duck",
      tvShows: ["Show 1"],
    };

    expect(calculateWinner(char1, char2)).toBe(1);
  });

  it("should return -1 when characters have equal appearances", () => {
    const char1: Character = {
      name: "Mickey Mouse",
      films: ["Film 1", "Film 2"],
    };

    const char2: Character = {
      name: "Donald Duck",
      tvShows: ["Show 1", "Show 2"],
    };

    // When characters have equal number of total appearances, it should return -1 (tie)
    expect(calculateWinner(char1, char2)).toBe(-1);
  });
});
