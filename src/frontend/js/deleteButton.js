'use strict'

const deleteButtons = document.querySelectorAll('.deleteButton')


deleteButtons.forEach((deleteButton) => {
    // console.log(url)
    deleteButton.addEventListener('click', (event) => {
        event.preventDefault()

        const row_anchor = event.target.previousSibling
        const url = row_anchor.getAttribute("href") + '/delete'
        function requestListener() {
            if (this.status == 200) {
            //    console.log(this.status + ": " + this.responseText);
               window.location.reload()
            }
            else{
                // console.log(this.status + ": " + this.responseText);
                // window.location.reload()
            }
        }
        let request = new XMLHttpRequest()
        request.onload = requestListener
        request.open("POST", url, true)
        // request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        request.send()
    })
})