// import express, express-formidable, cors, dotenv
const express = require("express");
const expressFormidable = require("express-formidable");
const cors = require("cors");
require("dotenv").config();
const uid2 = require("uid2");
const md5 = require("md5");
const axios = require("axios");

const hashFunction = require("./hashFunction");

// set up server
const app = express();
app.use(expressFormidable());
app.use(cors());

app.get("/", (req, res) => {
  res.json("Hello ! Welcome to Marvel !");
});

// request characters with offset and limit
app.get("/characters/", async (req, res) => {
  try {
    const { offset, limit } = req.query;
    const { ts, hash } = hashFunction();

    const response = await axios({
      url: "http://gateway.marvel.com/v1/public/characters",
      method: "get",
      params: {
        apikey: process.env.MARVEL_PUBLIC,
        ts,
        hash,
        offset,
        limit
      }
    });
    res.json(response.data.data);
  } catch (error) {
    res.status(error.code).json({ error: { message: error.status } });
  }
});

// request character with id
app.get("/characters/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { ts, hash } = hashFunction();

    const response = await axios({
      url: `http://gateway.marvel.com/v1/public/characters/${id}`,
      method: "get",
      params: {
        apikey: process.env.MARVEL_PUBLIC,
        ts,
        hash
      }
    });
    res.json(response.data.data);
  } catch (error) {
    res.status(error.code).json({ error: { message: error.status } });
  }
});

// request comics  with offset and limit adn related to character with id
app.get("/characters/:id/comics", async (req, res) => {
  try {
    const { id } = req.params;
    const { offset, limit } = req.query;
    const { ts, hash } = hashFunction();

    const response = await axios({
      url: `http://gateway.marvel.com/v1/public/characters/${id}/comics`,
      method: "get",
      params: {
        apikey: process.env.MARVEL_PUBLIC,
        ts,
        hash,
        offset,
        limit
      }
    });
    res.json(response.data.data);
  } catch (error) {
    res.status(error.code).json({ error: { message: error.status } });
  }
});

// request characters with offset and limit
app.get("/comics/", async (req, res) => {
  try {
    const { offset, limit } = req.query;
    const { ts, hash } = hashFunction();

    const response = await axios({
      url: "http://gateway.marvel.com/v1/public/comics",
      method: "get",
      params: {
        apikey: process.env.MARVEL_PUBLIC,
        ts,
        hash,
        offset,
        limit
      }
    });
    res.json(response.data.data);
  } catch (error) {
    res.status(error.code).json({ error: { message: error.status } });
  }
});

// search characters
app.get("/characters/search/:keyword", async (req, res) => {
  try {
    // console.log(req);
    const { keyword } = req.params;
    const { offset, limit } = req.query;
    // console.log(offset, limit);
    const keywordLC = keyword.toLowerCase();
    // console.log("keyword", keyword);
    // maximum size of a request is 100

    const { ts, hash } = hashFunction();
    const response = await axios({
      url: "http://gateway.marvel.com/v1/public/characters",
      method: "get",
      params: {
        apikey: process.env.MARVEL_PUBLIC,
        ts,
        hash,
        offset,
        limit,
        nameStartsWith: keywordLC
      }
    });
    res.json(response.data.data);
  } catch (error) {
    res.status(error.code).json({ error: { message: error.status } });
  }
});

// search comics
app.get("/comics/search/:keyword", async (req, res) => {
  try {
    // console.log(req);
    const { keyword } = req.params;
    const { offset, limit } = req.query;
    // console.log(offset, limit);
    const keywordLC = keyword.toLowerCase();
    // console.log("keyword", keyword);
    // maximum size of a request is 100

    const { ts, hash } = hashFunction();
    const response = await axios({
      url: "http://gateway.marvel.com/v1/public/comics",
      method: "get",
      params: {
        apikey: process.env.MARVEL_PUBLIC,
        ts,
        hash,
        offset,
        limit,
        titleStartsWith: keywordLC
      }
    });
    res.json(response.data.data);
  } catch (error) {
    res.status(error.code).json({ error: { message: error.status } });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("Server has started ! ");
});
