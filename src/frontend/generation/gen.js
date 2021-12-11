'use strict'

// const yaml = require('js-yaml');

let form = document.getElementById("file")

function loadFile(event) {
    event.preventDefault()
    let file = document.getElementById("myFile").files[0]
    console.log(file)
    // try {
    //     // let fileContents = fs.readFileSync('test.yaml', 'utf8');
    //     let data = yaml.safeLoad(file);

    //     console.log(data);
    // } catch (e) {
    //     console.log(e);
    // }
}

form.addEventListener('submit', loadFile)
