const fs = require("fs");
/// --------------------------------------------------------------------------------------------------
/// ----- --------------------------LECTURA DE XML "fast-xml-parser"----------------------------------
// ---------------------------------------------------------------------------------------------------
///  --------------VERSION 3.0 --------------------------
// fs.readFile("example.xml", "utf-8", (err, data) => {
//   if (err) {
//     console.error(err);
//     return;
//   }

//   const opciones = {
//     attributeNamePrefix: "",
//     ignoreAttributes: false,
//   };
//   const resultado = xmlParser.parse(data, opciones);

//   const libros = resultado.libros.libro;

//   libros.forEach((libro) => {
//     console.log("Título: " + libro.titulo);
//     console.log("Autor: " + libro.autor);
//     console.log("Año: " + libro.anio);
//   });
// });

/// ----- --------------------------LECTURA DE XML ----------------------------------------

const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");

/// instanciamos un nuevo objeto del metodo XMLParser
const parser = new XMLParser();

/// con la libreria fs y el metodo readFile leemos el archivo books, le ponemos el encoding y abrimos callback
fs.readFile("books.xml", "utf-8", (error, data) => {
  // gestionamos el error para mostrarlo en consola
  error && console.log(error);

  // parseamos la info con la libreria y el objeto parser que creamos en la linea 8
  const books = parser.parse(data);
  // enviamos la info a otra funcion que la gestiona
  read(books);
});

const read = (data) => {
  // destructuring de la data para coger el elemento libros
  const { libros } = data;

  /// la recorremos y la mostramos por consola
  libros.libro.map((libro, index) => {
    console.log(libro);
  });
};
