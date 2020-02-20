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
    const keywordLC = keyword.toLowerCase();
    // console.log("keyword", keyword);
    // maximum size of a request is 100
    const limit = 100;

    const promiseArray = [];
    const result = [];
    let total = 0;

    // to get the number of total characters and compute number of loops
    let offset = 0;
    const { ts, hash } = hashFunction();
    await axios({
      url: "http://gateway.marvel.com/v1/public/characters",
      method: "get",
      params: {
        apikey: process.env.MARVEL_PUBLIC,
        ts,
        hash,
        offset,
        limit
      }
    }).then(response => {
      total = response.data.data.total;
      // const extract = response.data.data.results;
      // extract.map(character => {
      //   const nameLC = character.name.toLowerCase();
      //   if (nameLC.includes(keywordLC)) {
      //     result.push(character);
      //   }
      // });
    });

    console.log("length", result.length);

    const numRequests = Math.floor(total / limit);
    // console.log("pages", numRequests);

    // process remainder of characters
    // to replace 5 by numRequests
    for (let i = 1; i <= numRequests; i++) {
      console.log(`Loop number ${i}`);
      offset = (i - 1) * limit;
      const { ts, hash } = hashFunction();

      promiseArray.push(
        await axios({
          url: "http://gateway.marvel.com/v1/public/characters",
          method: "get",
          params: {
            apikey: process.env.MARVEL_PUBLIC,
            ts,
            hash,
            offset,
            limit
          }
        }).then(response => {
          const extract = response.data.data.results;
          extract.map(character => {
            const nameLC = character.name.toLowerCase();
            if (nameLC.includes(keywordLC)) {
              result.push(character);
            }
          });
        })
      );
      await Promise.all(promiseArray);
      console.log("length", result.length);
    }

    res.json(result);
  } catch (error) {
    res.status(error.code).json({ error: { message: error.status } });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("Server has started ! ");
});
