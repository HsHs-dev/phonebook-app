const express = require('express')
const app = express()
const morgan = require('morgan')

morgan.token('body', req => JSON.stringify(req.body))

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))

let persons = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  const timestamp = Date.now()
  const date = new Date(timestamp)
  let responseText = 
    `<div>Phonebook has info for ${persons.length} people</div><br>${date}`
  res.send(responseText)
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const person = persons.find(person => person.id === id)
  if (person) {
    res.json(person)
  } else {
    res.statusMessage = `Person with id ${id} doesn't exist`
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

const generateId = () => {
  const id =  Math.floor(Math.random() * Number.MAX_VALUE)
  return String(id)
}

app.post('/api/persons/', (req, res) => {
  const body = req.body
  if (!body) {
    return res.status(400).json({
      error: 'content missing'
    })
  }

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number is missing'
    })
  }

  if (persons.some(person => person.name === body.name)) {
    return res.status(400).json({
      error: `name '${body.name}' already exists`
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)

  res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
