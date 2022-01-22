const Pool = require('pg').Pool

const pool = new Pool({
    user: 'user1',
    host: 'localhost',
    database: 'crud',
    password: 'password',
    port: 5432,
})

const initDB = async (sql, callback) => {
    pool.query(sql, (error, results) => {
        if (error) {
            throw error
        }
        else
            if (callback)
            callback(1) 
    })
}


module.exports = {
    initDB,
}