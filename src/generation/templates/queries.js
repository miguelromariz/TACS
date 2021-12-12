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

async function generateListingPage(table, table_name) {

    let file_content = "<ul>"
    for (let row in table) {
        const fields = table[row]
        const id = fields['id']
        let replacementDictionary = {
            href: `/${table_name.toLowerCase()}/${id}`,
            text: id
        }
        const tableListingHTMLElem = await generateListingHTMLElement(replacementDictionary, 
            'listingElement.html')
        file_content += `<li>${tableListingHTMLElem}</li>`
            // < a href = "/${table_name.toLowerCase()}/${id}" > ${ id }</a >
    }
    file_content += "</ul>"
    console.log(file_content)
    return generateHTMLFileContent(table_name, file_content, "src/frontend/index.html")
}

async function generateTableRowPage(row, table_name) {

    console.log("hey")
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

    return generateHTMLFileContent(table_name, file_content, "src/frontend/index.html")
}

//file generation
async function generateListingHTMLElement(replacementDictionary, template_file) {
    return generateFileContentFromTemplate(replacementDictionary, 'src/generation/templates/' + template_file)
}

async function generateHTMLFileContent(title, content) {
    let replacementDictionary = {
        title: title,
        content: content
    }
    return generateFileContentFromTemplate(replacementDictionary, 'src/generation/templates/index.html')
}

async function generateFileContentFromTemplate(replacementDictionary, src_dir) {
    let newFileContent = await fs.readFile(src_dir, 'utf8')
    for (let tag in replacementDictionary)
        newFileContent = newFileContent.replaceAll(`*${tag}`, replacementDictionary[tag])
    return newFileContent
}

module.exports = {
    *exports
}