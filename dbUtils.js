import mongoose from "mongoose";

const aka = mongoose.Schema({
  titleId: String,
  ondering: String,
  title: String,
  region: String,
  language: String,
  types: String,
  attributes: String,
  isOriginalTitle: String,
});

const name = mongoose.Schema({
  nconst: String,
  primaryName: String,
  primaryProfession: String,
  deathYear: String,
  birthYear: String,
  knownForTitles: String,
});

const Aka = mongoose.model("Aka", aka);
const Name = mongoose.model("Name", name);

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost:27017/imdb");

export async function getMovieLocalTitle(imdbID) {
  const query = await Aka.findOne({ titleId: imdbID }).exec();
  if (query) {
    return query.title;
  }
  return "";
}

export async function getNameAndId(nameArray, oscarYear, imdbID, job) {
  /* 
  Return { name, nameConst }
  
  First we check for how many names we have matched
  If we find more than one, we look for one that is on
  the knowForTitles.

  If there are more than one, throw an warning
  and link the imdb if found after the following steps:

  - Remove non-actors/actress/directors
  - DeathYear 5 years before oscarYear
  - Size of "KnowForTitles"

  Later on we can make another map of forced values
  */

  const foundNameArray = nameArray.map(async (person) => {
    const filteredName = await filterName(person);
    return { name: filteredName.primaryName, nameID: filteredName.nconst };

    // return person;
  });

  return await Promise.all(foundNameArray);

  async function filterName(name) {
    const results = await Name.find({ primaryName: name }).exec();
    if (results.length == 1) {
      return results[0];
    }

    const resultFilteredByKnownTitles = results.filter((person) => {
      return person.knownForTitles.includes(imdbID);
    });

    if (resultFilteredByKnownTitles.length == 1) {
      const personFound = resultFilteredByKnownTitles[0];
      const personUrl = "https://www.imdb.com/name/" + personFound.nconst;
      // logger.addWarning(`${name} found by Known titles: ${personUrl}`);

      return personFound;
    }

    const resultFilteredByDeathYear = results.filter((person) => {
      return !(Number(person.deathYear) < oscarYear - 5);
    });

    if (resultFilteredByDeathYear.length == 1) {
      const personFound = resultFilteredByDeathYear[0];
      const personUrl = "https://www.imdb.com/name/" + personFound.nconst;
      // logger.addWarning(`${name} found by death year: ${personUrl}`);
      return resultFilteredByDeathYear[0];
    }

    const resultFilteredByProfession = results.filter((person) => {
      if (job == "acting") {
        return (
          person.primaryProfession?.includes("actor") ||
          person.primaryProfession?.includes("actress")
        );
      } else if (job == "directing") {
        return person.primaryProfession?.includes("director");
      }
    });

    if (resultFilteredByProfession.length == 1) {
      const personFound = resultFilteredByProfession[0];
      const personUrl = "https://www.imdb.com/name/" + personFound.nconst;
      // logger.addWarning(`${name} found by profession: ${personUrl}`);
      return personFound;
    }

    const resultFilteredByLengthTitles = resultFilteredByProfession.sort(
      (a, b) => {
        return (
          b.knownForTitles.split(",").length -
          a.knownForTitles.split(",").length
        );
      }
    );

    if (resultFilteredByLengthTitles.length) {
      const personFound = resultFilteredByLengthTitles[0];
      const personUrl = "https://www.imdb.com/name/" + personFound.nconst;
      // logger.addWarning(`${name} found by 'knownFor' count: ${personUrl}`);
      return personFound;
    }

    // logger.addWarning(`${name} not found!`);
    return { primaryName: name, nconst: "" };
  }
}

export function disconnect() {
  mongoose.disconnect();
}
