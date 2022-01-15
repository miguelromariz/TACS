'use strict'

let showFormButton = document.getElementById('createButton')
let formDiv = document.getElementById('form-div')

if (showFormButton)
    showFormButton.addEventListener('click', (event) => {
        event.preventDefault()
        if (formDiv.classList.contains('hidden'))
            formDiv.classList.remove('hidden')
        else
            formDiv.classList.add('hidden');
    })

const checkboxes = formDiv.querySelectorAll('input[type="checkbox"]')
const form = formDiv.querySelector('form')


form.addEventListener('submit', (event) => {
    checkboxes.forEach((checkbox) => {
        const hidden_input = checkbox.previousSibling
        if (checkbox.checked)
            hidden_input.disabled = true
    })
})