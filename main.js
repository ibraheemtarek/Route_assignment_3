//part 1: Q1
// Use a readable stream to read a file in chunks and log each chunk
// Input Example: "./big.txt"
// Output Example: log each chunk
const fs = require("fs");
const path = require("path");
const filePath = path.resolve("./big.txt")
const distPath = path.resolve("./copy.txt")

const readStream = fs.createReadStream(filePath, { encoding: "utf-8", highWaterMark: 5 });
readStream.on("data", (chunk) => {
    console.log(chunk)
})


//part 1: Q2
// Use readable and writable streams to copy content from one file to another
const writableStream = fs.createWriteStream(distPath, { encoding: "utf-8" });

readStream.on("data", (chunk) => {
    writableStream.write(chunk)
})

//part 1: Q3
// Create a pipeline that reads a file, compresses it, and writes it to another file.
const zlib = require("zlib");
const destZipPath = path.resolve("./copy.txt.gz")
const writableStreamZip = fs.createWriteStream(destZipPath);

readStream.pipe(zlib.createGzip()).pipe(writableStreamZip)

