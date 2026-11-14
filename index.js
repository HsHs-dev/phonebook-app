const express = require("express");
const app = express();
const morgan = require("morgan");
require("dotenv").config();
const Entry = require("./models/entry");

morgan.token("body", (req) => JSON.stringify(req.body));

app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);
app.use(express.static("dist"));

const errorHandling = (err, req, res, next) => {
  console.log(err);

  if (err.name === "CastError") {
    res.status(400).send({ error: "malformed id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  next(err);
};

app.get("/api/persons", (req, res) => {
  Entry.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/info", (req, res) => {
  const timestamp = Date.now();
  const date = new Date(timestamp);
  Entry.estimatedDocumentCount().then((count) => {
    res.send(`<div>Phonebook has info for ${count} people</div><br>${date}`);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  Entry.findById(req.params.id)
    .then((entry) => {
      if (entry) {
        res.json(entry);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Entry.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons/", (req, res, next) => {
  const body = req.body;
  if (!body) {
    return res.status(400).json({
      error: "content missing",
    });
  }

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name or number is missing",
    });
  }

  const person = new Entry({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((person) => {
      res.json(person);
    })
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body;

  Entry.findById(req.params.id)
    .then((entry) => {
      if (!entry) {
        return res.status(404).end();
      }

      entry.name = name;
      entry.number = number;

      return entry.save().then((updatedEntry) => {
        res.json(updatedEntry);
      });
    })
    .catch((err) => next(err));
});

app.use(errorHandling);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
