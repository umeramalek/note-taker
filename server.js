const fs = require('fs');
const express = require('express');
const db = require('./Develop/db/db.json');

const PORT = 3001;
const app = express();
const path = require('path');
const { v4: uuidv4 } = require('uuid');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/notes", (req,res)=>{
    let htmlFile = path.join(__dirname, '/public/notes.html')
    console.log(htmlFile)
    res.sendFile(htmlFile)
})


console.log(db)
app.get("/api/notes", (req,res)=>{
    res.send(db)
})

function updateNote(){
    const stringNote = JSON.stringify(db, null, "\t");

        fs.writeFile(`./db/db.json`, stringNote, (err) =>
            err
                ? console.error(err)
                : console.log(
                    `Database has been updated`
                )
        );
}

// Receives POST request when user hits the save button, puts the db.json into the database
app.post('/api/notes', (req, res) =>{
    console.log(`${req.method} request recieved to save note`)

    const {title, text} = req.body;

    if(title && text){
        const newNote = {
            title,
            text,
            id: uuidv4()
        };

        // db is called as a dependency and directly pushed to
        db.push(newNote);

        updateNote();

        const response = {
            status: "success",
            body: newNote,
        };

        console.log(response);
        res.json(response);
    } else{
        res.json("failed to save note");
    }
});

app.delete('/api/notes/:id', (req, res) =>{
    // deconstructs the req object, sets id param to an ID;
    const { id } = req.params;

    // array method to find the index associated with that ID
    const noteIndex = db.findIndex(obj => obj.id == id)

    // logs the title name to send as a response to the user
    let titleDeleted = db[noteIndex].title;

    // splice 1 item at that index
    db.splice(noteIndex, 1);
    //call the update database method
    updateNote();
    res.json(`Deleted the note titled ${titleDeleted}`);
})





app.get("*", (req,res)=>{
    let htmlFile = path.join(__dirname, '/public/index.html')
    console.log(htmlFile)
    res.sendFile(htmlFile)
})



app.listen(PORT, () =>
  console.log(`Express server listening on port ${PORT}!`)
);