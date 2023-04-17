/// ----- --------------------------ESCRITURA DE XML ----------------------------------------

// --------------EJEMPLO 1: SIN ELEMENTO ROOR ----ESTO DA ERROR tiene que tener un elemento grapeador padre
/// Nos traemos la libreria FS  y XMLBuilder
const fs = require("fs");
const { XMLBuilder } = require("fast-xml-parser");

/// ------- DOC: https://github.com/NaturalIntelligence/fast-xml-parser/blob/97713ad3ec709f4612118120ce3fde310eed60ec/docs/v4/3.XMLBuilder.md

/// Contruimos el objeto que queremos transformar a XML
const people = [
  {
    nombre: "Pedro",
    apellido: "Lerida",
    edad: 29,
  },
  {
    nombre: "Lucia",
    apellido: "Lopez",
    edad: 32,
  },
  {
    nombre: "Esteban",
    apellido: "Gonzalez",
    edad: 31,
  },
];

// Metemos la options que necesita el objeto que construye el XML
let options = {
  ignoreAtributes: false,
  format: true,
  arrayNodeName: "people",
};

// Instanciamos el nuevo el objeto de la clase XMLBuilder
const builder = new XMLBuilder(options);

// sacamos el elemento construido en la variable output
output = builder.build(people);

// Utilizamos fs para hacer la construccion del fichero

/// -----> 1) El nombre del fichero
/// -----> 2) El elemento construido de XML  que queremos escribir en el archivo
/// -----> 3) Le metemos una callBack donde mostramos el console.log diciendo que todo ok
fs.writeFile("people.xml", output, () => {
  console.log("Esta escrito el archivo XML👌");
});

// ----------------- CONSTRUIR IN XML CON UN ELEMENTO PADRE DE LA COLECCION -------------
// ----------------- Ejemplo 2 con el elemento padre o ROOT -------------lo correcto a nivel sintactico ---
options = {
  ignoreAtributes: false,
  format: true,
};

// ! ----- ESTA ES LA FORMA CORRECTA DE HACER UN OBJETO PARA QUE SE CONSTRUYA CON EL ELEMENTO PADRE
const peopleWorld = {
  peopleWorld: {
    people: [
      {
        name: "lucas",
        job: "dev",
        age: 23,
      },
      {
        name: "Andrea",
        job: "dev",
        age: "26",
      },
    ],
  },
};

const builderWithRoot = new XMLBuilder(options);

output = builderWithRoot.build(peopleWorld);

fs.writeFile("peopleWithRoot.xml", output, () => {
  console.log("Esta escrito el archivo XML con elemento padre👌");
});
