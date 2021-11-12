const express = require("express");
const fs = require("fs");
const path = require("path");
const uuid = require("./Assets/uuid.js");
//const db = require("./db/db.json");
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// app.get("/api/db", (req, res) =>
//   res.sendFile(path.join(__dirname, "/db/db.json"))
// );

app.get("/api/notes", (req, res) => {
  const read = fs.readFileSync("db/db.json");
  const db = JSON.parse(read);
  res.status(200).json(db);
});

app.get(`/api/notes/:id`, (req, res) => {
  // Coerce the specific search term to lowercase
  const returnedNote = req.params.id.toLowerCase();

  // Iterate through the terms name to check if it matches `req.params.term`
  for (let i = 0; i < db.length; i++) {
    if (returnedNote === db[i].term.toLowerCase()) {
      return res.json(db[i]);
    }
  }

  // Return a message if the term doesn't exist in our DB
  return res.json("No match found");
});

app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to add a note`);
  console.log(req.body);
  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    const noteData = JSON.parse(fs.readFileSync("./db/db.json"));
    noteData.push(newNote);
    const notefile = JSON.stringify(noteData);

    fs.writeFile(`./db/db.json`, notefile, (err) =>
      err ? console.error(err) : console.log(` ${newNote.title} has been saved`)
    );

    const response = {
      status: "success",
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json("Error in adding note");
  }
});
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
