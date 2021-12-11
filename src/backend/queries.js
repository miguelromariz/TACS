const Pool = require('pg').Pool

const pool = new Pool({
    user: 'user1',
    host: 'localhost',
    database: 'crud',
    password: 'password',
    port: 5432,
})

const Patient = {
list: (request, response) => {
    pool.query('SELECT * FROM Patient ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
},
}
const Doctor = {
list: (request, response) => {
    pool.query('SELECT * FROM Doctor ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
},
}


module.exports = {
    Patient, Doctor, 
}