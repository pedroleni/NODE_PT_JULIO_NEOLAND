//fs es la libreria incluida con node que nos sirve para gestionar la lectura y escritura de ficheros
const fs = require("fs");

// fs tiene el metodo readFile para leer ficheros con una callback y el nombre del fichero con valores de la funcion readFile
fs.readFile("movies.json", (error, movie) => {
  const parsedMovies = [];

  /// gestionamos los errores con un ternario
  error
    ? console.log("No se han podido leer los ficheros ❌")
    : /// importante es parsear la informacion
      parsedMovies.push(JSON.parse(movie));

  console.log(parsedMovies);
});
