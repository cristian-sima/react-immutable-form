// @flow
/* eslint-disable no-console, no-undefined */

const fileName = "config.json";

const fs = require("fs");

const file = require(`../${fileName}`);

file.isProduction = true;

fs.writeFile(fileName, JSON.stringify(file, null, 2), (err) => {

  if (err) {
    return console.log(err);
  }

  return undefined;
});
