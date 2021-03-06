const express = require('express')
const path = require('path');
const bodyParser = require('body-parser')
let fs = require('fs')
const app = express()
const port = 3000

const db = require('./src/backend/queries')

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

for (let table_name in db){

    const methods = db[table_name]
    const base_dir = `/${table_name}`
    app.get(base_dir, methods["list"])
    app.get(`${base_dir}/:id`, methods["get"])
    app.post(base_dir, methods["create"])
    app.post(`${base_dir}/:id/update`, methods["update"])
    app.post(`${base_dir}/:id/delete`, methods["delete"])
}

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})