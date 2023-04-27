const express = require('express')
const morgan = require('morgan')
const app = express()
morgan.token('res-body', (req, res) => JSON.stringify(req.body))
app.use(express.json(), morgan(':method, :url, :status, :res[content-length] - :response-time ms, :res-body'))
const port = 3001
const persons = [
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 1
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 2
    }
]

const generateId = () => {
    return Math.ceil(Math.random()*1000)
}
app.get('/info', (req, res) => {
    res.send(
        `<p>Phonebook has info for ${persons.length} people</p><p>
         ${new Date()}</p>`
    );
})
app.get('/api/persons', (req, res) => {
    res.json(persons)
})
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    person ? res.json(person) : res.status(404).end()
})
app.post('/api/persons', (req, res) => {
    const body = req.body
    if(!body.name || !body.phone){
        return res.status(400).json({
            error: 'Content Missing'
        })
    }
    const nameExist = persons.filter(person => person.name === body.name).length
    if(nameExist >= 1){
        return res.status(400).json({
            error: 'Name Must Be Unique'
        })
    }
    const person = {
        id: generateId(),
        name: body.name,
        phone: body.phone
    }
    persons.push(person)
    res.send(persons)
})
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const personIndex = persons.findIndex(p => p.id === id);
    persons.splice(personIndex, 1);
    res.status(204).end()
})
app.listen(port, () => {
    console.log(`Server running on PORT ${port}`)
})
