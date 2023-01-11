This script downloads data from Oscar movies based on a list of awards nominees.

This project is a work in progress, expect changes and unstability.

The script expects and array with an object for each award with the following format:

```ts
 {
    shortName,
    winner,
    nominees: [
      { title},
      { title},
      { title},
      { title},
      { title},
      ...
    ],
  }
```

Here is an example:

```js
 {
    shortName: "filme",
    winner: "CODA",
    nominees: [
      { title: "Belfast" },
      { title: "CODA" },
      { title: "Don't Look Up" },
      { title: "Drive My Car" },
      { title: "Dune" },
      { title: "King Richard" },
      { title: "Licorice Pizza" },
      { title: "Nightmare Alley" },
      { title: "The Power of the Dog" },
      { title: "West Side Story" },
    ],
  }
```

The script uses data from two sources:

- [The IMDb datasets](https://www.imdb.com/interfaces/)
- [The OMDb API](https://www.omdbapi.com/)

So you need a valid API Key for the OMDb API, and to download the following IMDb datasets:

- `title.akas.tsv.gz`: Includes name translation for the movies. You can filter for only your region using [ripgrep](https://github.com/BurntSushi/ripgrep). `rg -e "\tBR\t" title.akas.tsv > titles.akas.br.tsv`
- `title.basics.tsv.gz`: Includes data from all IMDb titles. To filter for only movies, use `rg -e "tt[0-9]*\tmovie" title.basics.tsv > movies.tsv`
- `name.basics.tsv.gz`: Includes information for all crew members

_You need to manually re-include the header line if you filter using ripgrep_

Total size of those files should be around 700mb after filtering (695mb from `name.basics`). I'm looking for suggestions on how to filter and reduce the size of those files.

You need to import those datasets to a [MongoDB](mongodb.com/) database. [MongoDB Compass](https://www.mongodb.com/products/compass) can easily import from `tsv` files. The following database structure is expected:

```
-> imdb           // Database
|-> akas          // Collection from title.akas data
|-> movies        // Collection from title.basics data
|-> names         // Collection from name.basics data
```
