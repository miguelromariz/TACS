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
        let fileContents = fs.readFileSync('assets/model.yaml', 'utf8');
        let data = yaml.load(fileContents);

        console.log(data);
        let tables = getTables(data)
        generateBackend(tables)
        generateFrontend(tables)
    } catch (e) {
        console.log(e);
        return
    }
}

function getTables(file_data) {

    let tables = {}

    for (let table_name in file_data) {
        if (file_data.hasOwnProperty(table_name)) {
            let fields = file_data[table_name]
            // console.log(table_name + "\n->\n" + JSON.stringify(fields))
            for (let name in fields) {
                fields[removeFunkyChars(name)] = removeFunkyChars(fields[name])

                if (name !== removeFunkyChars(name))
                    delete fields[name]
            }
            tables[removeFunkyChars(table_name)] = fields
        }

    }
    // console.log(tables)
    return tables
}

function removeFunkyChars(str) {
    return str.toLowerCase().replace(/([^a-z0-9]+)/gi, '')
}
//backend
function generateBackend(tables) {
    generateSQL(tables)
    generateQueries(tables)
}

function generateTableFieldSQL(field_name, field_type){
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
    let field_sql = field_name
    switch(field_type){
        case "text": 
            field_sql += " TEXT,\n";
            break;
        case "number": 
            field_sql += " INTEGER,\n";
            break;
        case "bool":
            field_sql += " BOOL,\n";
            break;
        default: 
            field_sql += ` INTEGER REFERENCES ${field_type}(id) ON DELETE SET NULL,\n`;  
            break;
    }
    return field_sql
}

function generateSQL(tables){

    let file_content = "--drop\n"

    for (let table_name in tables) {
        file_content += "DROP TABLE IF EXISTS " + table_name + " cascade;\n"
    }

    file_content += "--tables\n"
    for (let table_name in tables) {
        file_content += "CREATE TABLE " + table_name + "(\n"
        file_content += "id SERIAL PRIMARY KEY,\n";
        for (let field in tables[table_name]){
            file_content += generateTableFieldSQL(field, tables[table_name][field])
        }
        file_content = file_content.substring(0, file_content.length - 2);
        file_content += "\n);\n"
    }

    fs.writeFileSync('src/backend/seed.sql', file_content, err => {
        if (err) {
            console.error(err)
            return
        }
    })

    // return file_content
}

function generateQueries(tables){

    let file_content = ""
    let queryFunctionNames = []
    
    file_content += "const tables = " + JSON.stringify(tables) + "\n"

    for (let table_name in tables) {
        file_content += `const ${table_name} = {\n`
        file_content += getTableListingQuery(table_name)
        file_content += getTableElementQuery(table_name)
        file_content += createTableElementQuery(tables[table_name], table_name)
        file_content += deleteTableElementQuery(table_name)
        file_content += updateTableElementQuery(tables[table_name], table_name)
        file_content += '}\n'
        queryFunctionNames.push(table_name)
    }

    let exports = "" 
    for (let key in queryFunctionNames)
        exports += `${queryFunctionNames[key]}, `

    generateQueriesFile(exports, file_content, "src/backend/queries.js")
}

function getTableListingQuery(table_name){
    
    return `list: (request, response) => {
    pool.query('SELECT * FROM ${table_name} ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        generateListingPage(results.rows, "${table_name}", tables).then( html => {
            response.send(html)
        })
        // response.status(200).json(results.rows)
    })
},\n`

}

function getTableElementQuery(table_name) {
    return `get: (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM ${table_name} WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        generateTableRowPage(results.rows[0], "${table_name}", tables).then( html => {
            response.send(html)
        })
        // response.status(200).json(results.rows)
    })
},\n`
}

function createTableElementQuery(table, table_name) {
    let fields = ""
    let field_nums = ""
    let num = 1
    for (let field_name in table){
        fields += `${field_name},`
        field_nums += `\$${num},`
        num += 1
    }
    fields = fields.substring(0, fields.length - 1);
    field_nums = field_nums.substring(0, field_nums.length - 1);
    return `create: (request, response) => {
        const { ${fields} } = request.body
        console.log("oi: " + JSON.stringify(request.body))
        pool.query('INSERT INTO ${table_name} (${fields}) VALUES (${field_nums})', [${fields}], (error, results) => {
            if (error) {
                throw error
            }
            response.redirect('/${table_name}');
            // response.status(201).send(\`User added with ID: \${results.id}\`)
        })
    },\n`
}

function deleteTableElementQuery(table_name) {
    return `delete: (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM ${table_name} WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.redirect('/${table_name}');
        // response.status(200).send(\`User deleted with ID: \${id}\`)
    })
},\n`
}

function updateTableElementQuery(table, table_name) {
    let fields = ""
    let setInstruction = "SET "
    let num = 2
    for (let field_name in table) {
        fields += `${field_name},`
        setInstruction += `${field_name} = \$${num},`
        num += 1
    }
    fields = fields.substring(0, fields.length - 1);
    setInstruction = setInstruction.substring(0, setInstruction.length - 1);
    return `update: (request, response) => {
        const { ${fields} } = request.body
        const id = parseInt(request.params.id)
        console.log("oi: " + JSON.stringify(request.body))
        pool.query('UPDATE ${table_name} ${setInstruction} WHERE id = $1', [id, ${fields}], (error, results) => {
            if (error) {
                throw error
            }
            response.redirect(\`/${table_name}/\${id}\`);
            // response.status(201).send(\`User added with ID: \${results.id}\`)
        })
    },\n`
}

//frontend
function generateFrontend(tables){
    generateIndex(tables)
}

function generateIndex(tables){
    
    let file_content = '<ul class="dbListing">'
    for (let table_name in tables) {
        file_content += `<li class="dbListingElem"><a href="/${table_name}">${table_name}</a></li>`
    }
    file_content += "</ul>"
    generateHTMLFile("Manage Database", file_content, "src/frontend/index.html")

}




//file generation
function generateHTMLFile(title, content, dest_dir) {
    let replacementDictionary = {
        title: title,
        content: content
    }
    generateFileFromTemplate(replacementDictionary, 'src/generation/templates/pages/index.html', dest_dir)
}

function generateQueriesFile(exports, content, dest_dir) {
    let replacementDictionary = {
        exports: exports,
        content: content
    }
    generateFileFromTemplate(replacementDictionary, 'src/generation/templates/queries.js', dest_dir)
}
//#TODO: DICTIONARY WITH REPLACEMENT TAGS AND CONTENT
function generateFileFromTemplate(replacementDictionary, src_dir, dest_dir){
    let newFileContent = fs.readFileSync(src_dir).toString()
    for (let tag in replacementDictionary)
        newFileContent = newFileContent.replaceAll(`*${tag}`, replacementDictionary[tag])
    fs.writeFileSync(dest_dir, newFileContent, err => {
        if (err) {
            console.error(err)
            return
        }
    })
}

module.exports = {
    loadFile
}