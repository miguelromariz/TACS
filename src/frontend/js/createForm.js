'use strict'

let showFormButton = document.getElementById('createButton')
let form = document.getElementById('form-div')

if (showFormButton)
    showFormButton.addEventListener('click', (event) => {
        event.preventDefault()
        form.classList.remove('hidden')
    })