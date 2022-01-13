var unsaved = false;
var lastUnsaved = false;
var row = 1;
var maxRows = 1;
function getRowAmt(num) {
    return 8 + num * 4;
}
function addRows(n) {
    row += n;
    row = Math.max(row, 1);
    numRows.innerText = row;
    if (row > rowArray.length) {
        maxRows = row;
        rowArray[rowArray.length] = [new Array(getRowAmt(rowArray.length)).fill(0), new Array(getRowAmt(rowArray.length) / 2).fill(0)];
    }
    while (row < rowArray.length && rowArray[rowArray.length - 1][0].every(n=>n == 0)) {
        if (row < rowArray.length && rowArray[rowArray.length - 1][0].every(n=>n == 0)) {
            rowArray.pop();
        }
        chairSelect.max = rowArray[row - 1][0].length - 1;
        doSelectUpdate();
    }
    chairSelect.max = rowArray[row - 1][0].length - 1;
}
workspace.style.width = "100%";
workspace.style.height = "100%";
workspace.width = workspace.offsetWidth;
workspace.height = workspace.offsetHeight;
var ctx = workspace.getContext("2d");

var rowArray = [[[0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0]]];

function frame() {
    doSelectUpdate();
    render();
    if (unsaved != lastUnsaved) {
        if (unsaved) {
            window.onbeforeunload = function() {
                return "Are you sure you want to leave? You have unsaved changes.";
            }
        } else {
            window.onbeforeunload = null;
        }
    }
    lastUnsaved = unsaved;
}

setInterval(frame, 100);

var poss = [];
function render() {
    cEdit.innerText = `Currently editing: ${wNameInput.value == "" ? "[no name]" : wNameInput.value}${unsaved ? " (unsaved)" : ""}`;
    var curSelStand = Math.floor(chairSelect.value / 2);
    var curSelChair = chairSelect.value % 2;
    var width = workspace.width;
    var height = workspace.height;
    var rRad = width / 10 * 0.6;
    workspace.style.width = "100%";
    workspace.style.height = "100%";
    workspace.width = workspace.offsetWidth;
    workspace.height = workspace.offsetHeight;
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText(wNameInput.value, 0, 30);
    for (var i = 4; i < colorControls.children.length - 2; i += 4) {
        ctx.fillStyle = colorControls.children[i + 1].value;
        ctx.beginPath();
        ctx.arc(10, 50 + (i - 1) / 3 * 15, 5, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.font = "15px Arial";
        ctx.fillText(colorControls.children[i].value, 20, 55 + (i - 1) / 3 * 15);
    }
    ctx.fillStyle = "black";
    ctx.lineWidth = 1;
    var cstandx = width / 2;
    var cstandy = height - 40;
    ctx.fillRect(cstandx - 10, cstandy, 20, 20);
    poss = [];
    for (var i = 0; i < rowArray.length; i++) {
        var r = (i + 1) * rRad;
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.arc(cstandx, cstandy, r, Math.PI, Math.PI * 2);
        ctx.stroke();
        for (var j = 0; j < rowArray[i][1].length; j++) {
            var standPercent = j / rowArray[i][1].length;
            standPercent += 1 / rowArray[i][1].length / 2;
            var sdx = Math.cos(standPercent * Math.PI) * r;
            var sdy = Math.sin(standPercent * Math.PI) * r;
            poss.push([cstandx - sdx, cstandy - sdy, 4, i, j * 2, 1]);
            if (rowArray[i][1][j] != 0) {
                ctx.fillStyle = colorControls.children[rowArray[i][1][j] * 4 + 1].value;
                ctx.beginPath();
                ctx.arc(cstandx - sdx, cstandy - sdy, 4, 0, 2 * Math.PI);
                ctx.fill();
            }
            if (j == curSelStand && i == row - 1 && show.checked) {
                ctx.strokeStyle = "black";
                ctx.lineWidth = 2;
            } else {
                ctx.strokeStyle = "#888888";
                ctx.lineWidth = 1;
            }
            ctx.beginPath();
            ctx.arc(cstandx - sdx, cstandy - sdy, 5, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.lineWidth = 1;

            var chairPercent1 = j * 2 / rowArray[i][0].length;
            chairPercent1 += 1 / rowArray[i][1].length / 4;
            var c1dx = Math.cos(chairPercent1 * Math.PI) * (r + 20);
            var c1dy = Math.sin(chairPercent1 * Math.PI) * (r + 20);
            poss.push([cstandx - c1dx, cstandy - c1dy, 2, i, j * 2, 0]);
            if (rowArray[i][0][j * 2] != 0) {
                ctx.fillStyle = colorControls.children[rowArray[i][0][j * 2] * 4 + 1].value;
                ctx.beginPath();
                ctx.arc(cstandx - c1dx, cstandy - c1dy, 2, 0, 2 * Math.PI);
                ctx.fill();
            }
            if (i == row - 1 && j == curSelStand && curSelChair == 0 && show.checked) {
                ctx.strokeStyle = "black";
                ctx.lineWidth = 2;
            } else {
                ctx.strokeStyle = "#888888";
                ctx.lineWidth = 1;
            }
            ctx.beginPath();
            ctx.arc(cstandx - c1dx, cstandy - c1dy, 3, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.lineWidth = 1;

            var chairPercent2 = (j * 2 + 1) / rowArray[i][0].length;
            chairPercent2 += 1 / rowArray[i][1].length / 4;
            var c2dx = Math.cos(chairPercent2 * Math.PI) * (r + 20);
            var c2dy = Math.sin(chairPercent2 * Math.PI) * (r + 20);
            poss.push([cstandx - c2dx, cstandy - c2dy, 2, i, j * 2 + 1, 0]);
            if (rowArray[i][0][j * 2 + 1] != 0) {
                ctx.fillStyle = colorControls.children[rowArray[i][0][j * 2 + 1] * 4 + 1].value;
                ctx.beginPath();
                ctx.arc(cstandx - c2dx, cstandy - c2dy, 2, 0, 2 * Math.PI);
                ctx.fill();
            }
            if (i == row - 1 && j == curSelStand && curSelChair == 1 && show.checked) {
                ctx.strokeStyle = "black";
                ctx.lineWidth = 2;
            } else {
                ctx.strokeStyle = "#888888";
                ctx.lineWidth = 1;
            }
            ctx.beginPath();
            ctx.arc(cstandx - c2dx, cstandy - c2dy, 3, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.lineWidth = 1;
        }
    }
}

function doStandChange() {
    unsaved = true;
    rowArray[row - 1][1][Math.floor(chairSelect.value / 2)] = standColor.selectedIndex;
    rowArray[row - 1][0][Math.floor(chairSelect.value / 2) * 2] = chairColor.selectedIndex = standColor.selectedIndex;
    rowArray[row - 1][0][Math.floor(chairSelect.value / 2) * 2 + 1] = chairColor.selectedIndex = standColor.selectedIndex;
}
function doChairChange() {
    unsaved = true;
    rowArray[row - 1][0][chairSelect.value] = chairColor.selectedIndex;
}
function doSelectUpdate() {
    chairColor.selectedIndex = rowArray[row - 1][0][chairSelect.value];
    standColor.selectedIndex = rowArray[row - 1][1][Math.floor(chairSelect.value / 2)];
}

function exportDocument(wName, wPrint=false) {
    window.cstate = show.checked;
    show.checked = false;
    render();
    var w = window.open("about:blank");
    w.document.head.appendChild(w.document.createElement("title")).innerText = wName;
    var url = workspace.toDataURL();
    var stats = w.document.createElement("div");
    var im = w.document.createElement("img");
    im.src = url;
    stats.append(im);
    stats.append(w.document.createElement("br"));
    var ins = getInstrumentList();
    var rowStandSubTotals = new Array(rowArray.length).fill(0).map(()=>new Array(ins.length).fill(0));
    var rowSubTotals = new Array(rowArray.length).fill(0).map(()=>new Array(ins.length).fill(0));
    for (var i = 0; i < rowArray.length; i++) {
        for (var j = 0; j < rowArray[i][0].length; j++) {
            if (rowArray[i][0][j] > 0) {
                rowSubTotals[i][rowArray[i][0][j] - 1]++;
            }
        }
        for (var j = 0; j < rowArray[i][1].length; j++) {
            if (rowArray[i][1][j] > 0) {
                rowStandSubTotals[i][rowArray[i][1][j] - 1]++;
            }
        }
    }
    var table = w.document.createElement("table");
    var topRow = w.document.createElement("tr");
    topRow.appendChild(document.createElement("td")).appendChild(w.document.createTextNode("chairs:stands"));
    topRow.children[topRow.children.length - 1].classList.toggle("ontop");
    for (var i = 0; i < ins.length; i++) {
        topRow.appendChild(document.createElement("td")).appendChild(w.document.createTextNode(colorControls.children[4 + i * 4].value));
        topRow.children[topRow.children.length - 1].classList.toggle("ontop");
    }
    topRow.appendChild(document.createElement("td")).appendChild(w.document.createTextNode("Total"));
    topRow.children[topRow.children.length - 1].classList.toggle("ontop");
    table.appendChild(topRow);

    for (var i = 0; i < rowSubTotals.length; i++) {
        var cRowTotalC = 0;
        var cRowTotalS = 0;
        var cRow = w.document.createElement("tr");
        cRow.appendChild(w.document.createElement("td")).innerText = `Row ${i + 1}`;
        cRow.children[0].classList.toggle("onleft");
        for (var j = 0; j < rowSubTotals[i].length; j++) {
            cRowTotalC += rowSubTotals[i][j];
            cRowTotalS += rowStandSubTotals[i][j];
            cRow.appendChild(w.document.createElement("td")).innerText = `${rowSubTotals[i][j]}:${rowStandSubTotals[i][j]}`;
        }
        cRow.appendChild(w.document.createElement("td")).innerText = `${cRowTotalC}:${cRowTotalS}`;
        table.appendChild(cRow);
    }
    var cRow = w.document.createElement("tr");
    cRow.appendChild(document.createElement("td")).appendChild(w.document.createTextNode("Total"));
    cRow.children[0].classList.toggle("onleft");
    var listC = 0;
    var listS = 0;
    for (var i = 0; i < rowSubTotals[0].length; i++) {
        var cRowTotalC = 0;
        var cRowTotalS = 0;
        for (var j = 0; j < rowSubTotals.length; j++) {
            cRowTotalC += rowSubTotals[j][i];
            cRowTotalS += rowStandSubTotals[j][i];
        }
        listC += cRowTotalC;
        listS += cRowTotalS;
        cRow.appendChild(w.document.createElement("td")).innerText = `${cRowTotalC}:${cRowTotalS}`;
    }
    cRow.appendChild(w.document.createElement("td")).innerText = `${listC}:${listS} (${+nBasses.value + listS} with basses)`;
    table.appendChild(cRow);
    table.children[0].children[0].classList.toggle("onleft");
    stats.appendChild(table);
    stats.appendChild(w.document.createElement("br"));
    stats.appendChild(w.document.createElement("p")).innerText = `(Basses) ${nBasses.value} stools, +${nBasses.value} stands`;
    stats.appendChild(w.document.createElement("span")).innerText = "Made with Aidan's Orchestra Seating Generator";
    w.document.body.appendChild(stats);

    var style = w.document.createElement("style");
    //console.log(Math.floor(95/(ins.length+2)));
    style.innerText = `td {width: ${Math.floor(95/(ins.length+2))}%; height: 20px; border: 1px dashed} .onleft {border-right: 2px solid} .ontop {border-bottom: 2px solid}`;
    w.document.head.appendChild(style);
    show.checked = cstate;
    if (wPrint) {
        setTimeout(function() {
            w.print();
        }, 250);
    }
}

function save() {
    var output = {
        data: rowArray,
        colors: getColorList(),
        instruments: getInstrumentList(),
        name: wNameInput.value,
        basses: nBasses.value
    }
    var b = new Blob([JSON.stringify(output)],{
        type: "application/json"
    });
    var u = URL.createObjectURL(b);
    var a = document.createElement("a");
    a.href = u;
    a.download = wNameInput.value + ".seats";
    a.click();
    unsaved = false;
}
function load() {
    if (unsaved && !confirm("Warning: you will lose any unsaved changes. Proceed anyway?")) return;
    if (fi.files.length == 0)
        return;
    var fr = new FileReader();
    fr.onload = function() {
        res = JSON.parse(fr.result);
        rowArray = res.data;
        wNameInput.value = res.name;
        nBasses.value = res.basses;
        colorControls.innerHTML = '<span></span><input type="hidden" id="p0" value="#ffffff" /><span></span><span></span><button onclick="addColor()" id="cAdder">Add Instrument</button><br>';
        for (var i = 0; i < res.instruments.length; i++) {
            addColor();
        }
        for (var i = 0; i < res.instruments.length; i++) {
            colorControls.children[4 + i * 4].value = res.instruments[i];
            colorControls.children[4 + i * 4 + 1].value = res.colors[i];
        }
        row = 1;
        chairSelect.value = 0;
        addRows(0);
        updateSelectOptions();
        unsaved = false;
    }
    fr.readAsText(fi.files[0]);
}
var expandRadius = 3;
workspace.onclick = function doClickChairSelect(e) {
    var rect = workspace.getBoundingClientRect()
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    for (var i = 0; i < poss.length; i++) {
        if (isInArea(x, y, poss[i][0], poss[i][1], poss[i][2] + expandRadius)) {
            show.checked = true;
            row = poss[i][3] + 1;
            numRows.innerText = row;
            addRows(0);
            chairSelect.value = poss[i][4];
            doSelectUpdate();
            return;
        }
    }
    addRows(0);
    show.checked = false;
}
function isInArea(x, y, targetX, targetY, radius) {
    var dx = x - targetX;
    var dy = y - targetY;
    var dist = Math.sqrt(dx * dx + dy * dy);
    return dist <= radius;
}

window.onkeydown = function(e) {
    if (!wsfocus)
        return;
    if (e.key == "ArrowUp") {
        show.checked = true;
        addRows(1);
    }
    if (e.key == "ArrowDown") {
        show.checked = true;
        addRows(-1);
    }
    if (e.key == "ArrowLeft") {
        show.checked = true;
        if (!e.shiftKey) {
            chairSelect.value = Math.max(+chairSelect.value - 1, +chairSelect.min);
        } else {
            if (+chairSelect.value != 1) {
                chairSelect.value = Math.max(+chairSelect.value - 2, +chairSelect.min);
            }
        }
    }
    if (e.key == "ArrowRight") {
        show.checked = true;
        if (!e.shiftKey) {
            chairSelect.value = Math.min(+chairSelect.value + 1, +chairSelect.max);
        } else {
            if (+chairSelect.value != +chairSelect.max - 1) {
                chairSelect.value = Math.min(+chairSelect.value + 2, +chairSelect.max);
            }
        }
    }
    if (e.key == "1") {
        show.checked = true;
        if (e.shiftKey) {
            chairColor.selectedIndex = 1;
            doChairChange();
        } else {
            standColor.selectedIndex = 1;
            doStandChange();
        }
    }
    if (e.key == "2") {
        show.checked = true;
        if (e.shiftKey) {
            chairColor.selectedIndex = 2;
            doChairChange();
        } else {
            standColor.selectedIndex = 2;
            doStandChange();
        }
    }
    if (e.key == "3") {
        show.checked = true;
        if (e.shiftKey) {
            chairColor.selectedIndex = 3;
            doChairChange();
        } else {
            standColor.selectedIndex = 3;
            doStandChange();
        }
    }
    if (e.key == "4") {
        show.checked = true;
        if (e.shiftKey) {
            chairColor.selectedIndex = 4;
            doChairChange();
        } else {
            standColor.selectedIndex = 4;
            doStandChange();
        }
    }
    if (e.key == "Delete") {
        show.checked = true;
        if (e.shiftKey) {
            chairColor.selectedIndex = 0;
            doChairChange();
        } else {
            standColor.selectedIndex = 0;
            doStandChange();
        }
    }
    if (e.key == "P") {
        // uppercase (shift+p)
        exportDocument(wNameInput.value, true);
    }
    if (e.key == "p") {
        // lowercase
        exportDocument(wNameInput.value, false);
    }
    if (e.key == "s") {
        save();
    }
    if (e.key == "l") {
        fi.click();
        wsfocus = true;
        wshold.style.outline = "3px solid";
        controls.style.outline = "1px solid";
        workspace.focus();
    }
    if (e.key == "r") {
        location.reload();
    }
    if (e.key == "c") {
        if (!confirm("Are you sure you want to clear the entire row?")) return;
        for (var i = 0; i < rowArray[row - 1][0].length; i++) {
            rowArray[row - 1][0][i] = 0;
        }
        for (var i = 0; i < rowArray[row - 1][1].length; i++) {
            rowArray[row - 1][1][i] = 0;
        }
        unsaved = true;
    }
    if (e.key == "m") {
        window.open("merge/merge.html");
    }
}

var wsfocus = true;
var last = true;
window.onclick = function(e) {
    wsfocus = (e.target == workspace);
    if (wsfocus) {
        wshold.style.outline = "3px solid";
        controls.style.outline = "1px solid";
        if (wsfocus != last) {
            show.checked = true;
        }
    } else {
        wshold.style.outline = "1px solid";
        controls.style.outline = "3px solid";
    }

    if (e.target != expander && e.target != content && content.classList.contains("expanded")) {
        content.classList.remove("expanded");
        content.classList.add("nonexpanded");
    }
    last = wsfocus;
}

function addColor() {
    unsaved = true;
    var tInput = document.createElement("input");
    tInput.type = "text";
    tInput.placeholder = "Enter instrument name";
    colorControls.insertBefore(tInput, cAdder);
    tInput.onchange = function() {
        updateSelectOptions()
    }

    var cInput = document.createElement("input");
    cInput.type = "color";
    colorControls.insertBefore(cInput, cAdder);

    var button = document.createElement("button");
    button.onclick = function(e) {
        deleteColor(e)
    }
    ;
    button.innerText = "Delete";
    colorControls.insertBefore(button, cAdder);

    colorControls.insertBefore(document.createElement("br"), cAdder);
}
function updateSelectOptions() {
    unsaved = true;
    standColor.innerHTML = "<option>Off</option>";
    chairColor.innerHTML = "<option>Off</option>";
    for (var i = 4; i < colorControls.children.length - 2; i += 4) {
        standColor.innerHTML += `<option>${colorControls.children[i].value}</option>`;
        chairColor.innerHTML += `<option>${colorControls.children[i].value}</option>`;
    }
}
function deleteColor(e) {
    var num = (Array.from(colorControls.children).indexOf(e.target) - 2) / 4;
    var d1 = e.target;
    var d2 = d1.previousElementSibling;
    var d3 = d2.previousElementSibling;
    var d4 = d3.previousElementSibling;
    var parent = d1.parentElement;
    parent.removeChild(d1);
    parent.removeChild(d2);
    parent.removeChild(d3);
    parent.removeChild(d4);
    for (var i = 0; i < rowArray.length; i++) {
        for (var j = 0; j < rowArray[i][0].length; j++) {
            if (rowArray[i][0][j] == num)
                rowArray[i][0][j] = 0;
            if (rowArray[i][0][j] >= num)
                rowArray[i][0][j]--;
        }
        for (var j = 0; j < rowArray[i][1].length; j++) {
            if (rowArray[i][1][j] == num)
                rowArray[i][1][j] = 0;
            if (rowArray[i][1][j] >= num)
                rowArray[i][1][j]--;
        }
    }
}
function getInstrumentList() {
    var listOut = [];
    for (var i = 4; i < colorControls.children.length - 2; i += 4) {
        listOut.push(colorControls.children[i].value);
    }
    return listOut;
}
function getColorList() {
    var listOut = [];
    for (var i = 4; i < colorControls.children.length - 2; i += 4) {
        listOut.push(colorControls.children[i + 1].value);
    }
    return listOut;
}
function toggleExpanded() {
    if (content.classList.contains("nonexpanded")) {
        content.classList.add("expanded");
        content.classList.remove("nonexpanded");
    } else {
        if (content.classList.contains("expanded")) {
            content.classList.add("nonexpanded");
        } else {
            content.classList.add("expanded");
        }
    }
}