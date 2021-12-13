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
    form_content = generateCreateFormHTML(table_name, tables_model)
    let replacementDictionary = {
        title: table_name + " listing",
        content: file_content,
        form: form_content
    }
    return generateHTMLFileContent(replacementDictionary, 'tableListing.html')
}

async function generateTableRowPage(row, table_name) {

    let file_content = "<ul>"
    for (let field in row) {
        const value = row[field]
        let replacementDictionary = {
            field: field,
            value: value
        }
        const tableListingHTMLElem = await generateListingHTMLElement(replacementDictionary,
            'tableRow.html')
        file_content += `<li>${tableListingHTMLElem}</li>`
    }
    file_content += "</ul>"
    let replacementDictionary = {
        title: table_name,
        content: file_content
    }
    return generateHTMLFileContent(replacementDictionary, "index.html")
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

function generateCreateFormHTML(table_name, tables_model){
    
    const table_model = tables_model.filter(obj => {
        return obj.name === table_name
    })[0]
    let inputsHTML = `<form action="/${table_name}" method="post">`
    for (let field in table_model.fields)
    {
        inputsHTML += `<label>${field}<input type="text" id="${field}" name="${field}"></label>`
    }
    return inputsHTML + '<input type ="submit" value="Submit"></form>'
}

module.exports = {
    *exports
}