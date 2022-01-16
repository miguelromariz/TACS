const path = require('path');
const generation = require('./src/generation/gen')
const db_init = require('./src/generation/init_db')
let fs = require('fs')


generation.loadFile()
// console.log(sql)
let sql = fs.readFileSync('src/backend/seed.sql').toString()
db_init.initDB(sql, process.exit)