const path = require('path');
const generation = require('./src/generation/gen')
const db = require('./src/generation/db')
let fs = require('fs')


generation.loadFile()
// console.log(sql)
let sql = fs.readFileSync('src/backend/seed.sql').toString()
db.initDB(sql, process.exit)