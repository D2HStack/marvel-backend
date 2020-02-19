// import express, express-formidable, cors, dotenv
const express = require("express");
const expressFormidable = require("express-formidable");
const cors = require("cors");

// request utility
const request = require("./utility/request");

// set up server
const app = express();
app.use(expressFormidable());
app.use(cors());

app.get("/characters/all", async (req, res) => {
  try {
    const { offset, limit } = req.fields;
    // console.log(limit);
    // request(url, method, offset, limit)
    const response = await request(
      "http://gateway.marvel.com/v1/public/characters",
      "get",
      0,
      100
    );
    const response100 = response.data.data.results;
    // console.log(response100.length);
    res.json("OK");
  } catch (error) {
    res.status(error.code).json({ error: { message: error.status } });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("Server has started ! ");
});