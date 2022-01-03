function addNewFileInput() {
    var filesDiv = document.getElementById("files");
    var containerDiv = document.createElement("div");
    var fileInput = document.createElement("input");
    fileInput.type = "file";
    var deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.onclick = deleteFileInput;
    containerDiv.appendChild(fileInput);
    containerDiv.appendChild(deleteButton);
    filesDiv.appendChild(containerDiv);
}

function deleteFileInput(e) {
    var filesDiv = document.getElementById("files");
    filesDiv.removeChild(e.target.parentElement);
}

async function merge() {
    var output = {
        data: [],
        colors: ["#000000"],
        instruments: ["In use"],
        name: "",
        basses: 0
    }
    var allData = await getAllFiles();
    var maxRows = Math.max(...allData.map(d=>d.data.length));
    for (var i = 0; i < maxRows; i++) {
        [numChairs, numStands] = getNumbersInRow(i, allData);
        var chairArray = new Array(numChairs).fill(0).map((_,j)=>allData.some(e=>e.data[i][0][j] > 0) ? 1 : 0);
        var standArray = new Array(numStands).fill(0).map((_,j)=>allData.some(e=>e.data[i][1][j] > 0) ? 1 : 0);
        output.data[i] = [chairArray, standArray];
    }
    output.name = prompt("Enter a name for your orchestra:", "Combined Orchestras");
    if (output.name == null) return;
    output.basses = Math.max(...allData.map(e=>e.basses));
    generateAndSaveFile(output);
}

async function getAllFiles() {
    var outputs = [];
    var files = document.getElementById("files");
    for (var i = 0; i < files.children.length; i++) {
        var file = files.children[i].children[0].files[0];
        outputs.push(await readFileJSON(file));
    }
    return outputs;
}

function getNumbersInRow(n, allData) { // chairs, stands
    for (var i = 0; i < allData.length; i++) {
        if (allData[i].data[n] != undefined) return [allData[i].data[n][0].length, allData[i].data[n][1].length];
    }
}

function generateAndSaveFile(output) {
    var blob = new Blob([JSON.stringify(output)],{type:"application/json"});
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = output.name + ".seats";
    a.click();
}

function readFileJSON(file) {
    return new Promise(function(resolve, reject) {
        var fr = new FileReader();
        fr.onload = function() {
            resolve(JSON.parse(fr.result));
        }
        fr.onerror = function(err) {
            reject(err);
        }
        fr.readAsText(file);
    })
}