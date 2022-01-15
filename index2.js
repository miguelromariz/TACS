const express = require('express')
const bodyParser = require('body-parser')
const generation = require('./src/generation/yamlgeneration')
let fs = require('fs')
const app = express()
const port = 3000


generation.loadFile()

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.use('/', express.static(__dirname + "/src/frontend"))

app.get('/', (request, response) => {
    response.sendFile("index.html")
})

app.post('/', (request, response) => {
    //console.log(request.body)
    generation.generateTablesYaml(request.body)
    response.redirect('/');
})

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})