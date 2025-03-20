const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Event handlers
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

const port = 3000;

app.listen(port, () => {
  console.log("Listening");
});
