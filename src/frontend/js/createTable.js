'use strict'

let addTable = document.getElementById('addTable')
let tableSpace = document.getElementById('createTable')
var countField = 1;
var numTables = 1;
let createButton = document.getElementById('createButton')
let form = document.getElementById("form")
let exists = false
let submitButton = document.getElementById("addField")

addTable.addEventListener('click', (event) => {
   /* tableSpace.innerHTML += '<label>Table Name <input type="text" id="tableName" name="TableName"></label>'+
                            '<button type="button" id="addField">Add Field</button>'+
                            '<div id="fields"></div>'*/

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
    //console.log(countField)

    addField.addEventListener('click', (event) => {
        if(event.target && event.target.id == "addField"){
            var fieldName = "Field"+ countField;
            var fieldNameId = "fieldName"+ countField;
            var fieldTypeId = "fieldType"+ countField;
        
            var newDiv = document.createElement("div")
        
            var inputLabel = document.createElement("label")
            inputLabel.innerHTML = fieldName + " Name"
        
            var fieldNameElement = document.createElement("input")
        
            fieldNameElement.setAttribute("type", "text")
            fieldNameElement.setAttribute("id", fieldNameId)
            fieldNameElement.setAttribute("name", fieldNameId)
        
            var inputLabel2 = document.createElement("label")
            inputLabel2.innerHTML = fieldName + " Type"
        
            var fieldType = document.createElement("input")
        
            fieldType.setAttribute("type", "text")
            fieldType.setAttribute("id", fieldTypeId)
            fieldType.setAttribute("name", fieldTypeId)
        
            inputLabel.appendChild(fieldNameElement)
            inputLabel2.appendChild(fieldType)
        
            newDiv.appendChild(inputLabel)
            newDiv.appendChild(inputLabel2)
        
            fields.appendChild(newDiv)
        
            countField += 1; 
        }
    })

    saveButtonElement.addEventListener("click", (event) => {
        let newTable = document.createElement("div")
        newTable.setAttribute("id", "table"+numTables)
        newTable.setAttribute("name", "table"+numTables)
        tableNameInput.toggleAttribute("disabled")
        tableNameInput.setAttribute("id", "table"+numTables)
        tableNameInput.setAttribute("name", "table["+numTables+"][name]")
        newTable.appendChild(tableNameInput)
        

        for(let i = 1; i <= countField-1; i++){
            let name = document.getElementById("fieldName" + i)
            let type = document.getElementById("fieldType" + i)

            name.toggleAttribute("disabled")
            type.toggleAttribute("disabled")
            name.setAttribute("id", "table"+numTables+"fieldName" + i)
            name.setAttribute("name", "table["+numTables+"][fieldName" + i+"]")
            type.setAttribute("id", "table"+numTables+"fieldType" + i)
            type.setAttribute("name", "table["+numTables+"][fieldType" + i+"]")

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
        console.log("saved")
    })
})


createButton.addEventListener("click", (event) => {
    event.preventDefault()
    document.querySelectorAll("input").forEach((texto) => {
        texto.toggleAttribute("disabled")
    })

    form.submit()
})












    
