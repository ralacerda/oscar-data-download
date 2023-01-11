const translateKeys = {
  Action: "Ação",
  Adventure: "Aventura",
  Animation: "Animação",
  Biography: "Biografia",
  Comedy: "Comédia",
  Crime: "Crime",
  Documentary: "Documentário",
  Drama: "Drama",
  Family: "Família",
  Fantasy: "Fantasia",
  "Film Noir": "Filme noir",
  History: "História",
  Horror: "Horror",
  Music: "Musica",
  Musical: "Musical",
  Mystery: "Mistério",
  Romance: "Romance",
  "Sci-Fi": "Ficção Científica",
  "Short Film": "Curta",
  Short: "Curta",
  Sport: "Esporte",
  Superhero: "Super-heroi",
  Thriller: "Suspense",
  War: "Guerra",
  Western: "Faroeste",
};

export const translateGenre = (genre) => {
  return translateKeys[genre];
};
