# 1.- CSV Lectura y escritura: **createReadStream**

La función **createReadStream** es una función de la biblioteca Node.js fs (sistema de archivos) que crea una secuencia de lectura a partir de un archivo.

En lugar de leer todo el contenido del archivo a la vez, lo que puede ser ineficiente o incluso imposible para archivos muy grandes, las secuencias permiten que el archivo se lea en fragmentos pequeños (como un kilobyte o más) mientras se lee. pedido. Esto hace que el manejo de archivos grandes sea más manejable y eficiente.
La función **createReadStream** toma como argumento el nombre del archivo a leer y devuelve un objeto stream que puedes utilizar para leer el contenido del archivo.

Una vez que tienes el stream, puedes utilizar otros métodos de la API de stream de Node.js, como **pipe**
o **on**, para procesar el contenido del archivo.

En el ejemplo que te mostré antes, utilizamos la función **createReadStream** para obtener el contenido del archivo CSV y luego lo pasamos a la función **csv-parse** a través del método pipe. El evento data se dispara cada vez que se lee una línea del archivo CSV, y el evento **end** se dispara cuando se termina de leer todo el archivo.
