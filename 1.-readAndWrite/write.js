const fs = require("fs");

// creamos un array el cual queremos escribir
const movie = [
  {
    title: "Infinity pool",
    year: 2023,
    availables: false,
  },
  {
    title: "dora",
    year: 2020,
    availables: true,
  },
  {
    title: "Infinity world",
    year: 2019,
    availables: true,
  },
];
/// añadir una nueva clave
const movieCopyAndIncrement = movie.map((movie, index) => ({
  ...movie,
  view: false,
}));
// modifcar una clave
const movieCopyAndIncrementTwo = movie.map((movie, index) => ({
  ...movie,
  availables: false,
}));

console.log(movieCopyAndIncrementTwo);

//// 1.- Convertir el objeto en un string
const movieJson = JSON.stringify(movieCopyAndIncrement);
console.log(movieJson);

///2.- Vamos a escribir el objeto con el metodo writeFile

fs.writeFile("movies.json", movie, () => {
  // en este caso si tenemos un error lo lanza directamente en la terminal para que podamos ver el typeError con la info
  console.log("👌Movies JSON created");
});
