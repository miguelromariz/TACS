const express = require('express')
const bodyParser = require('body-parser')
const generation = require('./src/generation/gen')
const db = require('./src/backend/queries')
let fs = require('fs')
const app = express()
const port = 3000


generation.loadFile()
// console.log(sql)
sql = fs.readFileSync('src/backend/seed.sql').toString()
db.initDB(sql)

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.use('/gen', express.static(__dirname + "/src/generation"))

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
})

const generate = (request, response) => {
    response.redirect()
}

app.get('/gen', (request, response) => {
    // response.json({ info: 'Node.js, Express, and Postgres API' })
    response.sendFile("index.html")
})
app.post('/gen', generate)

app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})