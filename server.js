const fs = require('fs');
const express = require('express');
const jsonData = require('./Develop/db/db.json');

const PORT = 3001;
const app = express();
const path = require('path');
const util = require('util');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get("/notes", (req,res)=>{
    let htmlFile = path.join(__dirname, '/public/notes.html')
    console.log(htmlFile)
    res.sendFile(htmlFile)
})

app.get("*", (req,res)=>{
    let htmlFile = path.join(__dirname, '/public/index.html')
    console.log(htmlFile)
    res.sendFile(htmlFile)
})


// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);

console.log(jsonData)
app.get("/api/notes", (req,res)=>{
    res.send(jsonData)
    readFromFile(jsonData).then((data) => res.json(JSON.parse(data)));
})











app.listen(PORT, () =>
  console.log(`Express server listening on port ${PORT}!`)
);