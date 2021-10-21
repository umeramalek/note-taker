const fs = require('fs');
const express = require('express');
const jsonData = require('./Develop/db/db.json');

const PORT = 3001;
const app = express();
const path = require('path');
const util = require('util');
const uuid = require('uuid');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get("/notes", (req,res)=>{
    let htmlFile = path.join(__dirname, '/public/notes.html')
    console.log(htmlFile)
    res.sendFile(htmlFile)
})



console.log(jsonData)
app.get("/api/notes", (req,res)=>{
    res.send(jsonData)
})

// Promise version of fs.writeFile
const writeFileAsync = util.promisify(fs.writeFile);


app.post('/api/notes', (req, res) => {


    let note = JSON.stringify(req.body)
    const {title, text} = req.body;

    const newNote = {
        title,
        text,
        id: uuid
    }
    

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          const newArr = JSON.parse(data);
          
          

          newArr.push(newNote);
          writeFileAsync(
            './Develop/db.json',
            JSON.stringify(newArr, null, 4),
            (err) =>
              err
                ? console.error(err)
                : console.info('Successfully updated reviews!')
          );
        }
      });
    // console.info(`${req.method} request received to add a review`);
    res.json(`${req.method} request received to add a review`);
  });




app.get("*", (req,res)=>{
    let htmlFile = path.join(__dirname, '/public/index.html')
    console.log(htmlFile)
    res.sendFile(htmlFile)
})

app.delete('/api/notes/:id', (req,res)=> {
    console.log('hi');
});

app.listen(PORT, () =>
  console.log(`Express server listening on port ${PORT}!`)
);