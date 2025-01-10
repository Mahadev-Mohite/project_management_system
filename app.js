const express = require("express"); // importing the Express library to help us easily create a web server.
const PORT = 7000; //setting the port on which our server will listen for requests.
// initializing our Express application to build the server.
const db = require("./config/db");
const app = express();
// This middleware is used to parse incoming requests that contain JSON data in the body
app.use(express.json());

// we're telling our app to use the route handlers defined in another file (`./routes`).
app.use("/", require("./routes"));


// This makes our server listen for incoming requests on the specified port (7000).
app.listen(PORT, () => {
  console.log(`Server is running on the ${PORT}`);
});
