'use strict'

let addTable = document.getElementById('addTable')
let tableSpace = document.getElementById('createTable')
var countField = 1;
var numTables = 1;
let createButton = document.getElementById('createButton')
let form = document.getElementById("form")
let exists = false
let submitButton = document.getElementById("addField")
let loadTableButton = document.getElementById("loadTables")
let tableLabels = []

addTable.addEventListener('click', (event) => {


    addTable.disabled = true
    var tableLabel = document.createElement("label")
    tableLabel.innerHTML = "Table Name"
    tableLabel.setAttribute("id","tableLabel")
    var tableNameInput = document.createElement("input")
    tableNameInput.setAttribute("type", "text")
    tableNameInput.setAttribute("id", "tableName")
    tableNameInput.setAttribute("name", "TableName")
    tableLabel.appendChild(tableNameInput)
    tableSpace.appendChild(tableLabel)

    var addFieldButton = document.createElement("button")
    addFieldButton.setAttribute("id", "addField")
    addFieldButton.setAttribute("type", "button")
    addFieldButton.innerHTML = "Add Field"
    tableSpace.appendChild(addFieldButton)

    var fieldsDiv = document.createElement("div")
    fieldsDiv.setAttribute("id", "fields")
    tableSpace.appendChild(fieldsDiv)

    var saveButton = document.createElement("button")
    saveButton.setAttribute("id", "saveButton")
    saveButton.setAttribute("type", "button")
    saveButton.innerHTML = "Save"
    tableSpace.appendChild(saveButton)

    let addField = document.getElementById('addField')
    let fields = document.getElementById('fields')
    let saveButtonElement = document.getElementById('saveButton')
    let tableLabelElement = document.getElementById('tableLabel')

    addField.addEventListener('click', (event) => {
        if(event.target && event.target.id == "addField"){
            var fieldName = "Field"+ countField;
            var fieldNameId = "fieldName"+ countField;
            var fieldTypeId = "fieldType"+ countField;
        
            var newDiv = document.createElement("div")
        
            var inputLabel = document.createElement("label")
            inputLabel.innerHTML = fieldName + " Name"
        
            var fieldNameElement = document.createElement("input")

            inputLabel.appendChild(fieldNameElement)
            newDiv.appendChild(inputLabel)
        
            fieldNameElement.setAttribute("type", "text")
            fieldNameElement.setAttribute("id", fieldNameId)
            fieldNameElement.setAttribute("name", fieldNameId)
        
            var inputLabel2 = document.createElement("label")
            inputLabel2.innerHTML = fieldName + " Type"
        
            var fieldType = document.createElement("select")
        
            fieldType.setAttribute("id", fieldTypeId)
            fieldType.setAttribute("name", fieldTypeId)

            var option1 = document.createElement("option")
            option1.setAttribute("value", "text")
            option1.innerHTML+= "Text"
            var option2 = document.createElement("option")
            option2.setAttribute("value", "number")
            option2.innerHTML+= "Number"
            var option3 = document.createElement("option")
            option3.setAttribute("value", "bool")
            option3.innerHTML+= "Bool"

            fieldType.appendChild(option1)
            fieldType.appendChild(option2)
            fieldType.appendChild(option3)

            tableLabels.forEach((label) => {
                var extraOption = document.createElement("option")
                extraOption.setAttribute("value", label.toLowerCase())
                extraOption.innerHTML += label
                fieldType.appendChild(extraOption)
            })
        
            inputLabel2.appendChild(fieldType)
            newDiv.appendChild(inputLabel2)
        
            fields.appendChild(newDiv)
        
            countField += 1; 
        }
    })

    saveButtonElement.addEventListener("click", (event) => {

        //validate table name
        if(!/^[a-zA-Z_][a-z0-9_]*/.test(tableNameInput.value)){
            alert("Table name is invalid")
            return
        }
        if (countField === 1) {
            alert("Table must have at least one field")
            return
        }
        //

        let newTable = document.createElement("div")
        newTable.setAttribute("id", "table"+numTables)
        newTable.setAttribute("name", "table"+numTables)
        tableNameInput.toggleAttribute("disabled")
        tableNameInput.setAttribute("id", "table"+numTables)
        tableNameInput.setAttribute("name", "table["+numTables+"][name]")
        newTable.appendChild(tableNameInput)
        

        for(let i = 1; i <= countField-1; i++){
            let name = document.getElementById("fieldName" + i)
            let typeSelected = document.getElementById("fieldType" + i)

            //validate fields names
            if(!/^[a-zA-Z_][a-z0-9_]*/.test(name.value)){
                alert("Field name is invalid")
                return
            }
            //
            let type = document.createElement("input")

            name.toggleAttribute("disabled")
            type.toggleAttribute("disabled")
            name.setAttribute("id", "table"+numTables+"fieldName" + i)
            name.setAttribute("name", "table["+numTables+"][fieldName" + i+"]")
            type.setAttribute("id", "table"+numTables+"fieldType" + i)
            type.setAttribute("name", "table["+numTables+"][fieldType" + i+"]")
            type.value = typeSelected.options[typeSelected.selectedIndex].value

            newTable.appendChild(name)
            newTable.appendChild(type)
        }
        numTables+=1

        form.insertBefore(newTable, form.firstChild)

        addField.remove()
        tableLabelElement.remove()
        saveButtonElement.remove()
        fields.remove()
        countField = 1
        tableLabels.push(tableNameInput.value)
        addTable.disabled = false
    })
})


createButton.addEventListener("click", (event) => {
    event.preventDefault()
    document.querySelectorAll("input").forEach((texto) => {
        texto.toggleAttribute("disabled")
    })

    form.submit()
})


loadTableButton.addEventListener("change", async (event) => {
    const file = event.target.files[0]
    loadFile(file)
})

function loadFile(file) {
    const reader = new FileReader()
    let content

    reader.addEventListener("load",(event) =>{
        content = event.target.result
        loadTables(content)
    })

    reader.readAsText(file)
}

function loadTables(content) {
    let tables= {}
    let conteudo = content.split(";")
    conteudo.forEach((table) => {
        if(table != "\n"){
            let entries = table.split(":\n")
            let name = entries[0]
            name = name.replace(/\s+/g,"")
            let fields = entries[1]
            tables[name] = {}
            fields.split("\n").forEach((entry) => {
                entry = entry.replace(/\s+/g,"")
                let data = entry.split(":")
                let fieldName = data[0]
                let fieldType = data[1]
                tables[name][fieldName] = fieldType
            })
            
        }
    })
    
    Object.keys(tables).forEach((name) => {
        tableLabels.push(name)
        let newTable = document.createElement("div")
        newTable.setAttribute("id", "table"+numTables)
        newTable.setAttribute("name", "table"+numTables)

        let tableName = document.createElement("input")
        tableName.toggleAttribute("disabled")
        tableName.setAttribute("id", "tableName" + numTables)
        tableName.setAttribute("name", "table["+numTables+"][name]")
        tableName.value = name
        newTable.appendChild(tableName)
        let i = 1
        Object.keys(tables[name]).forEach((fieldName) => {
            let nameInput = document.createElement("input")
            nameInput.toggleAttribute("disabled")
            nameInput.setAttribute("id", "table"+numTables+"fieldName" + i)
            nameInput.setAttribute("name", "table["+numTables+"][fieldName" + i+"]")
            nameInput.value = fieldName
            let typeInput = document.createElement("input")           
            typeInput.toggleAttribute("disabled")
            typeInput.setAttribute("id", "table"+numTables+"fieldType" + i)
            typeInput.setAttribute("name", "table["+numTables+"][fieldType" + i+"]")
            typeInput.value = tables[name][fieldName]

            newTable.appendChild(nameInput)
            newTable.appendChild(typeInput)
            i += 1
        })
        form.insertBefore(newTable, form.firstChild)

        numTables+=1 
    })
}