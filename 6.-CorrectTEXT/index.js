import fs from "fs";
let data;

const readData = () => {
  // podeis hacer con el metodo synccrono readFileSync
  fs.readFile("ejemplo.txt", "utf8", (error, dataText) => {
    error && console.log(error);

    correctData(dataText);
  });
};

const correctData = (dataText) => {
  ///El carácter \D representa cualquier carácter que no sea un dígito.
  /// La bandera g en la expresión regular significa que la búsqueda debe ser global, es decir, buscar en todo el texto en lugar de solo la primera coincidencia.
  /// paginas para aprender expresiones regulares
  // ------> https://regex101.com/
  // ------> https://regexr.com/
  let fixedData = dataText.match(/\D/g).join("");
  writeText(fixedData);
};

const writeText = (dataText) => {
  fs.writeFileSync("ejemploCorregido.txt", dataText);
};
readData();
