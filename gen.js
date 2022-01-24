const express = require('express')
const bodyParser = require('body-parser')
const yamlGen = require('./src/generation/yamlgeneration')
const path = require('path');
const generation = require('./src/generation/gen')
const db_init = require('./src/generation/init_db')
let fs = require('fs')
const app = express()
const port = 3030
const backendDir = './src/backend';

if (!fs.existsSync(backendDir)) {
    fs.mkdirSync(backendDir, { recursive: true });
}

yamlGen.loadFile()

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.use('/', express.static(__dirname + "/src/frontend", { index: 'genYaml.html' }))

app.get('/', (request, response) => {
    response.sendFile("genYaml.html")
})

app.post('/', (request, response) => {
    //console.log(request.body)
    yamlGen.generateTablesYaml(request.body)
    generation.loadFile()
    // console.log(sql)
    let sql = fs.readFileSync('src/backend/seed.sql').toString()
    db_init.initDB(sql)
    response.redirect('/');
})

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})