import { getMovieGenres } from "./utils";

describe("Translate genre list", () => {
  test("Single name is translated", () => {
    expect(getMovieGenres("Action")).toEqual(["Ação"]);
  });
  test("Multiple names are translated", () => {
    expect(getMovieGenres("Action, Animation")).toEqual(["Ação", "Animação"]);
  });
  test("Returns an array", () => {
    expect(getMovieGenres("Action, Drama")).toBeInstanceOf(Array);
  });
});
