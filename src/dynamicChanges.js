'use strict'

let gen = require('./generation/gen')
let db = require('./generation/db')
let fs = require('fs')


function addTable(table, table_name, callback) {
    addTableSQL(table, table_name)
    updateQueriesFile(table, table_name, callback)
}

function addTableSQL(table, table_name) {
    console.log(table_name)
    console.log(table)
    const sql = gen.generateTableSQL(table_name, table)
    console.log(sql)
    db.initDB(sql) //todo: Temp, change this
}

function updateQueriesFile(table, table_name, callback){
    fs.readFile('src/backend/queries.js', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        var result = data.replace(/(const\s+tables\s+=\s+{(?:\s*"[^"]+":{(?:\s*"[^"]+":\s*"[^"]+"\s*[,}])*,?)*)\s*/, "$1 \"" + table_name + '": ' +JSON.stringify(table) + ",\n")
            .replace(/}\s+async\s+function/, "}\n" + gen.generateQueriesCode(table_name, table) + "async function")
            .replace(/(module.exports\s+=\s+{(?:\s+[a-zA-Z_\-]+,)*)\s*/, "$1" + table_name + ",\n")

        fs.writeFile('src/backend/queries.js', result, 'utf8', function (err) {
            if (err) return console.log(err);
            callback()
        });

    });
}



module.exports = {
    addTable
}