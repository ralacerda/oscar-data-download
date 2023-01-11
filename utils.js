import { translateGenre } from "./translateGenre.js";
import slugify from "slugify";

export function slugifyTitle(title) {
  return slugify(title, {
    lower: true,
    locale: "pt",
    strict: true,
  }).slice(0, 30);
}

export function getMovieAwards(title, awardData) {
  const awards = [];

  awardData.forEach((award) => {
    award.nominees
      .filter((nominee) => nominee.title == title)
      .forEach((nomiation) => {
        let winner;

        // We check if nominee is truthy
        if (nomiation.nominee) {
          winner = award.winner == nomiation.nominee ? true : false;
        } else {
          winner = award.winner == title ? true : false;
        }

        awards.push({
          shortName: award.shortName,
          nominee: nomiation.nominee ? nomiation.nominee : "",
          winner,
        });
      });
  });
  return awards;
}

export function getMovieGenres(genreList) {
  return genreList.split(", ").map((genre) => translateGenre(genre));
}
