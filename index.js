const { print, getPrinters, getDefaultPrinter } = require("unix-print");
const express = require("express");
require("dotenv").config();
const cronJob = require("cron").CronJob;
const path = require("path");
const fs = require("fs");
const app = express();

let printFiles;
let index = 0;
let options = ["-o fit-to-page", "-o media=Letter", "-q 100"]; //

const dir = path.resolve("files");

// reading all the files in the files folder
fs.readdir(dir, (err, files) => {
  if (err) return console.log(err);
  printFiles = files;
});

const job = new cronJob(
  process.env.CRON_JOB,
  function () {
    printJob();
  },
  null,
  true,
  process.env.CRON_TIMEZONE
);

job.start();

// update the index and get the next file ready to print
function getNextFileReady() {
  index++;
  if (index >= printFiles.length) index = 0;
}

function printJob() {
  print(path.join(dir, printFiles[index]), process.env.PRINTER_NAME, options)
    .then((res) => {
      console.log("Printer has started");
      getNextFileReady();
    })
    .catch((err) => console.log(err));
}

app.listen(5921, function () {
  console.log("Printer cron job started on port 5921");
});
