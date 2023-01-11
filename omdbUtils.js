import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const apikey = process.env.OMDB_APIKEY;
const baseURL = `http://www.omdbapi.com/?apikey=${apikey}`;

export async function getMovieByID(movieID) {
  return fetch(baseURL + "&i=" + movieID);
}

export async function getMovieByTitle(movieTitle) {
  return fetch(baseURL + "&t=" + movieTitle);
}

export async function getOMDBData(movieList, hardCodedValues) {
  const responses = await Promise.all(
    movieList.map(async (movieTitle) => {
      if (hardCodedValues[movieTitle]) {
        return await getMovieByID(hardCodedValues[movieTitle]);
      } else {
        return await getMovieByTitle(movieTitle);
      }
    })
  );
  return await Promise.all(responses.map((response) => response.json()));
}
