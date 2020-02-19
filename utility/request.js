// build parameters for a request with  axios
const axios = require("axios");
const md5 = require("md5");
const uid2 = require("uid2");

const dotenv = require("dotenv");
require("dotenv").config();

module.exports = async (url, method, offset, limit) => {
  // generate the timestamp adn hash
  const publicKey = process.env.MARVEL_PUBLIC;
  const privateKey = process.env.MARVEL_SECRET;
  const ts = uid2(64);
  const hash = md5(ts + privateKey + publicKey);

  const response = await axios({
    url,
    method,
    params: {
      apikey: publicKey,
      ts,
      hash,
      offset,
      limit
    }
  });

  return response;
};
