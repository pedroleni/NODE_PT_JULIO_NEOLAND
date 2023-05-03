const connect = require("./src/utils/db");
const albumsRouter = require("./src/api/routes/albums.routes");

connect();

//app.use("api/v1/albums", albumsRouter);
