const fs = require('fs');
const path = require('path');
const express = require('express');
const db = require('./Develop/db/db.json');
const { v4: uuidv4 } = require('uuid');


const PORT = process.env.PORT|| 3001;
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


// GET request - initialize notes.html
app.get("/notes", (req,res)=>{
    let htmlFile = path.join(__dirname, '/public/notes.html')
    console.log(htmlFile)
    res.sendFile(htmlFile)
})

// GET request - notes are sent as json in database
console.log(db)
app.get("/api/notes", (req,res)=>{
    res.send(db)
})


// to update database
function updateNote(){
    const stringNote = JSON.stringify(db, null, "\t");

        fs.writeFile(`./Develop/db/db.json`, stringNote, (err) =>
            err
                ? console.error(err)
                : console.log(
                    `updated`
                )
        );
}

// POST request
app.post('/api/notes', (req, res) =>{
    console.log(`${req.method} request recieved to save note`)

    const {title, text} = req.body;

    if(title && text){
        const newNote = {
            title,
            text,
            id: uuidv4()
        };

        // pushed in new array
        db.push(newNote);

        // call on the update
        updateNote();

        const response = {
            status: "success",
            body: newNote,
        };

        console.log(response);
        res.json(response);
    } else{
        res.json("failed ");
    }
});


// delete request
app.delete('/api/notes/:id', (req, res) =>{
   
    const { id } = req.params;
    const noteIndex = db.findIndex(obj => obj.id == id)
    let titleDeleted = db[noteIndex].title;
    db.splice(noteIndex, 1);
    updateNote();
    res.json(`Deleted the note titled ${titleDeleted}`);
})


// GET request - initialize index.html
app.get("*", (req,res)=>{
    let htmlFile = path.join(__dirname, '/public/index.html')
    console.log(htmlFile)
    res.sendFile(htmlFile)
})

// listen port
app.listen(PORT, () =>
  console.log(`Express server listening on port ${PORT}!`)
);