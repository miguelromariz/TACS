const Pool = require('pg').Pool
const fs = require('fs').promises

const pool = new Pool({
    user: 'user1',
    host: 'localhost',
    database: 'crud',
    password: 'password',
    port: 5432,
})

*content

async function generateListingPage(table_rows, table_name, tables_model) {
    let file_content = "<ul>"
    for (let row in table_rows) {
        const fields = table_rows[row]
        const id = fields['id']
        let replacementDictionary = {
            href: `/${table_name}/${id}`,
            text: id
        }
        const tableListingHTMLElem = await generateListingHTMLElement(replacementDictionary, 
            'listingElement.html')
        file_content += `<li>${tableListingHTMLElem}</li>`
            // < a href = "/${table_name}/${id}" > ${ id }</a >
    }
    file_content += "</ul>"
    let form_content = await generateCreateFormHTML(table_name, tables_model)
    let replacementDictionary = {
        title: table_name + " listing",
        content: file_content,
        form: form_content
    }
    return generateHTMLFileContent(replacementDictionary, 'tableListing.html')
}

async function generateTableRowPage(row, table_name, tables_model) {

    let file_content = "<ul>"
    for (let field in row) {
        let value = row[field]
        value = addAnchorToForeignKeyValue(value, table_name, tables_model, field, row['id'])

        let replacementDictionary = {
            field: field,
            value: value
        }
        const tableListingHTMLElem = await generateListingHTMLElement(replacementDictionary,
            'tableRow.html')
        file_content += `<li>${tableListingHTMLElem}</li>`
    }
    file_content += "</ul>"
    let form_content = await generateUpdateFormHTML(table_name, tables_model, row)
    let replacementDictionary = {
        title: table_name,
        content: file_content,
        form: form_content
    }
    return generateHTMLFileContent(replacementDictionary, "tableRow.html")
}

function addAnchorToForeignKeyValue(value, table_name, tables_model, field, id) {
    if (value !== null && value !== undefined && isFieldTypeTable(table_name, tables_model, field))
        value = `<a href="/${tables_model[table_name][field]}/${value}">${value}</a>`
    return value
}
//file generation
async function generateListingHTMLElement(replacementDictionary, template_file) {
    return generateFileContentFromTemplate(replacementDictionary, 'src/generation/templates/elements/' + template_file)
}

async function generateHTMLFileContent(replacementDictionary, page_file) {
    
    return generateFileContentFromTemplate(replacementDictionary, 'src/generation/templates/pages/' + page_file)
}

async function generateFileContentFromTemplate(replacementDictionary, src_dir) {
    let newFileContent = await fs.readFile(src_dir, 'utf8')
    for (let tag in replacementDictionary)
        newFileContent = newFileContent.replaceAll(`*${tag}`, replacementDictionary[tag])
    return newFileContent
}

//create form if updateInfo is undefined, update form otherwise
async function generateCreateFormHTML(table_name, tables_model){
    
    const table_model = getTableModel(tables_model, table_name)
    let inputsHTML = `<form action="/${table_name}" method="post">`
    for (let field_name in table_model)
    {
        inputsHTML += await generateCreateInputHTML(field_name, table_model[field_name])
    }
    return inputsHTML + '<input type ="submit" value="Submit"></form>'
}


//create form if updateInfo is undefined, update form otherwise
async function generateUpdateFormHTML(table_name, tables_model, row) {
    const table_model = getTableModel(tables_model, table_name)
    let inputsHTML = `<form action="/${table_name}/${row['id']}/update" method="post">`
    console.log("HEY")
    console.log(row)
    console.log(table_model)
    for (let field_name in table_model) {
        console.log(row[field_name])
        inputsHTML += await generateCreateInputHTML(field_name, table_model[field_name], row[field_name])
    }
    return inputsHTML + '<input type ="submit" value="Submit"></form>'
}


function getTableModel(tables_model, table_name) {
    return tables_model[table_name]
}

function isFieldTypeTable(table_name, tables_model, field_name){
    return field_name !== "id" && tables_model.hasOwnProperty(tables_model[table_name][field_name])
}

//create input if updateInfo is undefined, update info otherwise
async function generateCreateInputHTML(field_name, field_type, initialValue) {

    let initialValueAttribute = initialValue ? `value="${initialValue}"` : ''
    let inputHTML = ''
    switch (field_type) {
        case "text":
            inputHTML += `<input type="text" id="${field_name}" name="${field_name}" ${initialValueAttribute}>`
            break;
        case "number":
            inputHTML += `<input type="number" id="${field_name}" name="${field_name}" ${initialValueAttribute}>`
            break;
        case "bool":
            initialValueAttribute = initialValue ? 'checked' : ''
            inputHTML += `<input type="hidden" name="${field_name}" value=0><input type="checkbox" id="${field_name}" name="${field_name}" ${initialValueAttribute}>`
            break;
        default:
            const results = await pool.query(`SELECT id FROM ${field_type} ORDER BY id ASC`)
            // console.log(results.rows)
            let options = ""
            for (const row in results.rows){
                options += `<option value="${results.rows[row]["id"]}">${results.rows[row]["id"]}</option>`
            }
            inputHTML += `<select id="${field_name}" name="${field_name}">${options}</select>`
            break;
    }
    return `<label>${field_name}${inputHTML}</label>`
}

module.exports = {
    *exports
}