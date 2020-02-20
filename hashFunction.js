require("dotenv").config();
const uid2 = require("uid2");
const md5 = require("md5");

module.exports = () => {
  const ts = uid2(64);
  const hash = md5(ts + process.env.MARVEL_SECRET + process.env.MARVEL_PUBLIC);
  return { ts, hash };
};
