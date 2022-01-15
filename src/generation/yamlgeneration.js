'use strict'

let yaml = require('js-yaml')
let fs = require('fs')

function loadFile() {
    try {
        generateIndex2()
    } catch (e) {
        console.log(e);
        return
    }
}


function generateIndex2(){
    
    let file_content = '<button type="button" id="addTable">Add Table</button> <div id=createTable> </div>'+
                       '<form action="/" method="post" id="form">' +
                       '<input id="createButton" type ="submit" value="Submit DB"></input></form>'


                       /*<label>Table Name <input type="text" id="tableName" name="TableName"></label>
                       '<button type="button" id="addField">Add Field</button>'+
                       '<div id="fields"></div>'*/
                       
    

    generateHTMLFile("Create Table", file_content, "src/frontend/index.html")
}

//file generation
function generateHTMLFile(title, content, dest_dir) {
    let replacementDictionary = {
        title: title,
        content: content
    }
    generateFileFromTemplate(replacementDictionary, 'src/generation/templates/pages/index.html', dest_dir)
}


function generateTablesYaml(content){
    let tables = {}

    if(content != {}){

    
        if(Object.keys(content).length == 1 && content.TableName == ""){
            console.log("tabela vazia")
            return
        }
        
        content.table.forEach((tabela) => {
            tables[tabela.name] = {}

            let numVar = (Object.keys(tabela).length - 1)/2

            for(let i = 1; i <= numVar; i++){
                let nameString = "fieldName" + i
                let typeString = "fieldType" + i
                tables[tabela.name][tabela[nameString]] = tabela[typeString]
            }
        })
        let yamlstring = yaml.dump(tables)
        fs.writeFileSync('./assets/test2.yaml', yamlstring, 'utf8')
    }
    
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
    loadFile,
    generateTablesYaml
}