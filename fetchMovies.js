import { writeFile } from "fs";
import oscar2022 from "./oscar2022.js";

import { getOMDBData } from "./omdbUtils.js";
import { getMovieAwards, getMovieGenres, slugifyTitle } from "./utils.js";
import { getNameAndId, getMovieLocalTitle, disconnect } from "./dbUtils.js";

async function getMovieData(movie, oscarYear, awardData) {
  const localTitle = await getMovieLocalTitle(movie.imdbID);

  return {
    oscarYear,

    // We don't need to change the following values
    // but we change the key to lower case if needed
    title: movie.Title,
    poster: movie.Poster,
    plot: movie.Plot,
    imdbID: movie.imdbID,

    // We use unix timestamp since JSON doesn't have
    // a date type
    releasedDate: new Date(movie.Released).getTime(),

    // Remove the 'min' from the end and converts to number
    runtimeMin: Number(movie.Runtime.slice(0, -3)),
    genres: getMovieGenres(movie.Genre),
    awards: getMovieAwards(movie.Title, awardData),

    localTitle: localTitle == "N/A" ? movie.Title : localTitle,
    slug: slugifyTitle(localTitle),

    actors: await getNameAndId(
      movie.Actors.split(", "),
      oscarYear,
      movie.imdbID,
      "acting"
    ),
    directors: await getNameAndId(
      movie.Director.split(", "),
      oscarYear,
      movie.imdbID,
      "directing"
    ),
  };
}

function getListOfMovies(awardArray) {
  const movieList = new Set();
  awardArray.forEach((award) => {
    award.nominees.forEach((nominee) => {
      movieList.add(nominee.title);
    });
  });
  return Array.from(movieList);
}

const hard_code = {
  "West Side Story": "tt3581652",
};

const listOscar2022 = getListOfMovies(oscar2022);

// console.log(listOscar2022.length);

const omdb_oscar_2022 = await getOMDBData(listOscar2022, hard_code);

console.dir(omdb_oscar_2022);

const result2020 = await Promise.all(
  omdb_oscar_2022.map((movie) => getMovieData(movie, 2022, oscar2022))
);

disconnect();

function produceFinalObject(array) {
  return array.reduce((obj, movie) => {
    const { slug, ...values } = movie;
    return Object.assign(obj, { [slug]: values });
  }, {});
}

// write file to disk

const finalResult = produceFinalObject(result2020);

writeFile(
  "./resultOscar2022.json",
  JSON.stringify(finalResult),
  "utf8",
  (err) => {
    if (err) {
      console.log(`Error writing file: ${err}`);
    } else {
      console.log("File is written successfully!");
    }
  }
);
