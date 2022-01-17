const express = require('express')
const path = require('path');
const bodyParser = require('body-parser')
const generation = require('./src/generation/gen')
const yaml_gen = require('./src/generation/yamlgeneration')
const db_init = require('./src/generation/db')
let fs = require('fs')
const app = express()
const port = 3000
const dynamicChanges = require("./src/dynamicChanges")


generation.loadFile()
// console.log(sql)
let sql = fs.readFileSync('src/backend/seed.sql').toString()
db_init.initDB(sql)


let db = require('./src/backend/queries')

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.use('/', express.static(path.join(__dirname, "/src/frontend")))

app.get('/', (request, response) => {
    response.sendFile("index.html")
})

function addRoutes(table_name) {
    const methods = db[table_name]
    const base_dir = `/${table_name}`
    app.get(base_dir, methods["list"])
    app.get(`${base_dir}/:id`, methods["get"])
    app.post(base_dir, methods["create"])
    app.post(`${base_dir}/:id/update`, methods["update"])
    app.post(`${base_dir}/:id/delete`, methods["delete"])
}

for (let table_name in db) {
    addRoutes(table_name)
}


app.get(`/addTable`, yaml_gen.generateAddTablePage)
app.post(`/addTable`, (request, response) => {
    //console.log(request.body)
    const tables_array = yaml_gen.generateTablesArray(request.body)
    for (const i in tables_array){
        const table = tables_array[i]
        console.log(table)
        for (const table_name in table)
            dynamicChanges.addTable(table[table_name], table_name, () => {db = require('./src/backend/queries'); addRoutes[table_name]})
    }
    response.redirect('/');
})

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})