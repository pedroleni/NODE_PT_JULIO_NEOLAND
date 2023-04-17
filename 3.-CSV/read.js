const csv = require("csv-parser");
const fs = require("fs");

// Vamos a crear un array donde vamos a guardar los datos que del parse CSV
const datos = [];

// Leemos el archivo CSV
fs.createReadStream("indicator.csv")
  .pipe(csv({ separator: ";" }))
  .on("data", (data) => datos.push(data))
  .on("end", () => {
    console.log(datos);
  });
