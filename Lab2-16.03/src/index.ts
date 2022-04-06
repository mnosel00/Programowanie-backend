import { notStrictEqual } from "assert";
import express from "express";
import e, { Request, Response } from "express";
import { write } from "fs";
import { title } from "process";



const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

interface Tag {
  id?: number;
  name: string;
}

interface Note {
  title: string;
  content: string;
  createDate?: string;
  tags?: Tag[];
  id?: number;
  //user?: Login[];
}

interface Login {
  login: string;
  password: string;

  id?: number;
}

let tags: Tag[] = [];
let notatka: Note[] = [];

let user: Login[] = [
  {
    login: "a",
    password: "b",
    id: Date.now(),
  },
];
function Read(): void {
  var fs = require("fs");

  var data = fs.readFileSync("./data/notatka.json");
  var data2 = fs.readFileSync("./data/tag.json");

  notatka = JSON.parse(data);
  tags = JSON.parse(data2)

  //console.log(notatka);
  //console.log(tags)
}

function Write(): void {
  var fs = require("fs");

  fs.writeFileSync("./data/notatka.json", JSON.stringify(notatka));
  fs.writeFileSync("./data/tag.json", JSON.stringify(tags));
}
function protecion(req: any, res: any, next: any) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

app.post("/login", function (req, res) {
  const login = req.body.login;
  const password = req.body.password;

  let users: Login = {
    login: login,
    password: password,

    id: Date.now(),
  };
  const token = jwt.sign({ users }, "secret");

  user.push(users);
  res.send(token);
});


app.get("/users", function (req, res) {
  res.send(user);
});


//////////////////////////////// API do Tag
app.get("/tags", function (req, res) {
  Read();
  res.send(tags);
});

app.post("/tag", function (req, res) {
  Read();
  if (req.body.name) {
    const name = req.body.name.toLowerCase();
    var a = name.toLowerCase();

    const tagFind = tags.find((name) => name.name === a);

    if (tagFind) {
      res.status(404).send("Notatka o taiej nazwie już istnieje");
    } else {
      let tag: Tag = {
        name: req.body.name,
        id: Date.now(),
      };

      tags.push(tag);
      res.status(200).send(tag);
      Write();
    }
  } else {
    res.status(404).send("nie utworzono ");
  }

  //}
});

app.delete("/tag/:id", function (req, res) {
  Read();
  const { id } = req.params;
  const ID = +id;
  tags = tags.filter((tag) => tag.id !== ID); //true trzyma w tablicy
  Write();
  res.send("poszedł w piach");
});

app.put("/tag/:id", function (req, res) {
  Read();
  const { id } = req.params;
  const ID = +id;
  const name = req.body.name;

  name.toLowerCase();

  const tag = tags.find((note) => note.id === ID);

  if (name) {
    tag!.name = name;
  }
  res.send(tag);
  Write();
});

//////////////////////////////// API do Note
app.get("/notes", function (req, res) {
  Read();
  res.send(notatka);
});
app.get("/note/:id", function (req: Request, res: Response) {
  Read();
  const title = req.body.title;
  const content = req.body.content;

  var ID = req.params.id;
  const IDnumber = +ID;

  for (const item of notatka) {
    if (item.id == IDnumber && ID != null) {
      res.status(200).send(item);
    } else {
      res.status(404).send("Nie ma notatki z takim idkiem");
    }
  }
});

app.post("/note", function (req: Request, res: Response) {
  Read();
  if (req.body.title && req.body.content) {
    let note: Note = {
      title: req.body.title,
      content: req.body.content,
      createDate: new Date().toISOString(),
      tags: req.body.tags,
      id: Date.now(),
    };

    let tag: Tag = {
      id: Date.now(),
      name: req.body.tags,
    };

    var idToString = note.id!.toString();

    if (tag.name === undefined) {
      tag = {
        id: Date.now(),
        name: "Default",
      };
    }

    const name = tag.name.toString().toLowerCase();
    let tagNameToLowerCase = name.toLowerCase();

    const tagFind = tags.find((x) => x.name === tagNameToLowerCase);

    if (tagFind || tagNameToLowerCase === "default") {
      notatka.push(note);
      Write();
      // res.status(404).send("Notatka o taiej nazwie już istnieje");
    } else {
      tags.push(tag);
      notatka.push(note);

      Write();
    }

    res.status(200).send(idToString);
  } else {
    res.status(404).send("nie utworzono i elo");
  }
});

app.delete("/note/:id", (req, res) => {
  Read();
  const { id } = req.params;
  const ID = +id;

  notatka = notatka.filter((note) => note.id !== ID); //true trzyma w tablicy
  Write();
  res.send("poszedł w piach");
});

app.put("/note/:id", (req, res) => {
  Read();
  const { id } = req.params;
  const ID = +id;

  const { title, content, createDate, tags } = req.body;

  const note = notatka.find((note) => note.id === ID);
  if (note == null) {
    res.status(404).send("nie odnaleziono notatki");
  } else {
    function validateToken(note: any) {
      return note;
    }

    validateToken(note as any);

    if (title) {
      note!.title = title;
    }

    if (content) {
      note!.content = content;
    }

    if (createDate) {
      note!.createDate = createDate;
    }

    if (tags) {
      note!.tags = tags;
    }

    res.send(note);
    Write();
  }
});

app.listen(3000);
