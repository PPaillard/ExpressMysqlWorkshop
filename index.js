const express = require("express")
require('dotenv').config()

const app = express()
const port = process.env.APP_PORT || 5000;

app.use(express.json())

const welcome = (req, res) => {
    res.send("C'est pas faux => Online !");
  };
app.get("/", welcome);

const knightHandlers = require("./knightHandlers")

app.get("/api/knights", knightHandlers.getKnights)
app.get("/api/knights/:id", knightHandlers.getKnightById)
app.post("/api/knights", knightHandlers.addKnight)
app.put("/api/knights/:id", knightHandlers.updateKnightById)
app.delete("/api/knights/:id", knightHandlers.deleteKnightById)

app.listen(port, (err) => {
    if (err) {
      console.error("Something bad happened : ", err);
    } else {
      console.log(`Server is listening on ${port}`);
    }
  });
  