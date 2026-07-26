require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const  cors = require('cors')
const People = require('./models/people')
const errorHandler = require('./middleware/errorHandler')


const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})
app.use(morgan('tiny'))
app.use(morgan(':body'))

// const generateId = () => {
//   const maxId = persons.length > 0
//     ? Math.max(...persons.map(n => n.id))
//     : 0
//   return maxId + 1
// }

// MongoDB gère automatiquement les IDs

app.get('/api/persons', (request, response, next) => {
  People.find({}).then(people => {
        response.json(people)
  })
  .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  People.countDocuments({})
    .then(count => {
      const now = new Date()
      const html = `<p>Phonebook has info for ${count} people</p>
    <p>${now}</p>
    `
    response.send(html)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  People.findById(request.params.id)
    .then(person => {
      if (person) {
        return response.json(person)
      } else {
        return response.status(404).end()
      }      
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  
  //const id = Number(request.params.id)
  People.findByIdAndDelete(request.params.id)
    .then(_ => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons/', (request, response, next) => {
  const body = request.body
  if (!body.name || !body.number){
    return response.status(400).json({error : 'name and number must be given'})
  }

  const person = new People({
    name: body.name,
    number: body.number,
  })
  person.save()
  .then(result => response.json(result))
  .catch(error => next(error))    
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  People.findByIdAndUpdate(
    request.params.id,
    {name:body.name, number:body.number},
    {returnDocument : 'after', runValidators: true, context: 'query'}
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})