'use strict'

let yaml = require('js-yaml')
let fs = require('fs')


// interface Field {
//     name: string,
//     value: number | string | boolean 
// }

// interface DatabaseTable {
//     name: string, 
//     fields: Record<string, Field>
// }

function loadFile() {
    // console.log(file)
    try {
        let fileContents = fs.readFileSync('assets/test.yaml', 'utf8');
        let data = yaml.load(fileContents);

        console.log(data);
        let tables = getTables(data)
        generateSQL(tables)
    } catch (e) {
        console.log(e);
        return
    }
}

function getTables(file_data) {

    let tables = []

    for (let table_name in file_data) {
        if (file_data.hasOwnProperty(table_name)) {
            let fields = file_data[table_name]
            console.log(table_name + "\n->\n" + JSON.stringify(fields))

            tables.push({ name: table_name, fields: fields })
        }

    }

    return tables
}

function generateTableFieldSQL(field_name, field_value){
    return field_name + " TEXT,\n";
}

function generateSQL(tables){

    let file_content = "--drop\n"

    for (let key in tables) {
        let table = tables[key]
        file_content += "DROP TABLE IF EXISTS " + table.name + ";\n"
    }

    file_content += "--drop\n"
    for (let key in tables) {
        let table = tables[key]
        file_content += "CREATE TABLE " + table.name + "(\n"
        file_content += "id SERIAL PRIMARY KEY,\n";
        for (let field in table.fields){
            file_content += generateTableFieldSQL(field, table.fields[field])
        }
        file_content = file_content.substring(0, file_content.length - 2);
        file_content += "\n);\n"
    }
    // "
    // --drop
    // DROP TABLE IF EXISTS chat_member;

    // --Tables

    // CREATE TABLE regular(

    //         username TEXT PRIMARY KEY,
    //         password TEXT NOT NULL,
    //         entry_date TIMESTAMP WITH TIME zone DEFAULT now() NOT NULL,
    //         description TEXT,
    //         profile_picture TEXT,
    //         is_private BOOL DEFAULT TRUE,
    //         is_admin BOOL DEFAULT FALSE
    //     ); 
    // CREATE TABLE message(
    //     id SERIAL PRIMARY KEY,
    //     content TEXT NOT NULL,
    //     date_time TIMESTAMP WITH TIME zone DEFAULT now() NOT NULL,
    //     chat_id INTEGER REFERENCES chat(id) ON UPDATE CASCADE ON DELETE CASCADE,
    //     author TEXT REFERENCES regular(username) ON UPDATE CASCADE ON DELETE CASCADE
    // );"

    fs.writeFileSync('src/backend/seed.sql', file_content, err => {
        if (err) {
            console.error(err)
            return
        }
    })

    // return file_content
}

module.exports = {
    loadFile
}