const fs = require("fs");

const movies = [
  {
    title: "Star Wars",
    year: 2021,
    director: "Lucas Films",
  },
  {
    title: "Matrix",
    year: 1999,
    director: "Washoski Sisters",
  },
  {
    title: "Babilon",
    year: 2022,
    director: "Damiel chapelles",
  },
];
/// UTILIZAMOS ; PARA QUE EXCEL NOS LO LEA, el notion viene con ","
//Declaramos la función a la que le entra un JSON por argumento
const convertToCSV = (data) => {
  let csv = "";
  // leemos las keys del objeto
  let headers = Object.keys(data[0]);

  //creamos las cabeceras de csv
  csv += headers.join(";") + "\n";

  // creamos las filas de la data
  data.forEach((row) => {
    headers.forEach((header, index) => {
      if (index > 0) {
        csv += ";";
      }
      csv += row[header];
    });
    csv += "\n";
  });
  return csv;
};

// llamammos a la funcion y guardamos la info para luego escribir el archivo
const CSVtoFile = convertToCSV(movies);

fs.writeFile("movies.csv", CSVtoFile, (error) => {
  // gestionamos el error
  error
    ? console.log(`Existe un error en la ejecucion ❌`)
    : console.log("fichero creado👌");
});
