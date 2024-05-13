
const rootEl = document.getElementById('root');
const canvasEl = document.createElement('canvas');
rootEl.appendChild(canvasEl);
const ctx = canvasEl.getContext('2d');

const width = 1000;
const height = 800;
canvasEl.width = width;
canvasEl.height = height;
let scaleX = 100; // every 20 px is 1 unit
let scaleY = 100;
const lockAspectRatio = false;
const canvasCenter = [width / 2, height / 2];
const offset = [0, 0];
const tempOffset = [0, 0];
const extents = [-width / 2, width / 2, -height / 2, height / 2];
const tempExtents = [0, 0, 0, 0];
// panning changes the offset


const drawSin = [
    (x) => Math.sin(x),
    (x) => Math.sqrt(10 - x*x),
    (x) => -Math.sqrt(10 - x*x)
]

let mouseDownEvent = {};
let panning = false;
draw();
canvasEl.addEventListener('mousedown', (e) => {
    mouseDownEvent = e;
    canvasEl.addEventListener('mousemove', xxx);
});
canvasEl.addEventListener('mouseup', endDrag);

canvasEl.addEventListener('mouseout', endDrag);

function endDrag() {
    canvasEl.removeEventListener('mousemove', xxx);
    panning = false;
    offset[0] = tempOffset[0];
    offset[1] = tempOffset[1];
    extents[0] = tempExtents[0];
    extents[1] = tempExtents[1];
    extents[2] = tempExtents[2];
    extents[3] = tempExtents[3];
}

canvasEl.addEventListener('wheel', (e) => {
    if (lockAspectRatio) {
        scaleY += e.deltaY / 50;
        scaleX -= e.deltaY / 50;
    } else {
        if (e.altKey) {
            scaleY += e.deltaY / 50
        } else {
            scaleX += e.deltaY / 50;
        }
    }
    if (scaleX < 0)
        scaleX = 0;
    if (scaleY < 0)
        scaleY = 0;

    ctx.clearRect(0, 0, width, height);
    draw();
});

function xxx(e) {
    panning = true;
    const dx = e.offsetX - mouseDownEvent.offsetX;
    const dy = e.offsetY - mouseDownEvent.offsetY;
    ctx.clearRect(0, 0, width, height);
    tempOffset[0] = offset[0] + dx;
    tempOffset[1] = offset[1] + dy;
    tempExtents[0] = -canvasCenter[0] - offset[0] - dx;
    tempExtents[1] = -canvasCenter[0] - offset[0] + width - dx;
    tempExtents[2] = -canvasCenter[1] + offset[1] + dy;
    tempExtents[3] = -canvasCenter[1] + offset[1] + dy + height;
    draw();
}

function drawCircle(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
    ctx.fill();
}




function drawXAxis(x, dx, dy) {
    const currentExtents = getExtents();
    const currentOffset = getOffset();
    const step = (currentExtents[1] - currentExtents[0]) / 1000;
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(canvasCenter[0] + currentOffset[0] + currentExtents[0], canvasCenter[1] + currentOffset[1]);
    ctx.lineTo(canvasCenter[0] + currentOffset[0] + currentExtents[1], canvasCenter[1] + currentOffset[1]);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(canvasCenter[0] + currentOffset[0], canvasCenter[1] + currentOffset[1] - currentExtents[2]);
    ctx.lineTo(canvasCenter[0] + currentOffset[0], canvasCenter[1] + currentOffset[1] - currentExtents[3]);
    ctx.stroke();

}

function draw() {
    //drawer(drawCircle, 100, 100);
    arrayDrawer(drawXAxis)
    ctx.strokeStyle = 'black';
    drawSin.forEach(element => {
        arrayDrawer(element);
    });
}

function arrayDrawer(func) {
    const currentExtents = getExtents();
    const currentOffset = getOffset();
    const step = (currentExtents[1] - currentExtents[0]) / 2000;
    ctx.beginPath();
    for (let i = currentExtents[0]; i < currentExtents[1]; i += step) {
        const y = func(i / scaleX) * scaleY;

        ctx.lineTo(canvasCenter[0] + currentOffset[0] + i, canvasCenter[1] + currentOffset[1] - y);
    }
    ctx.stroke();
}

function drawer(func, x, y) {
    const currentOffset = getOffset();
    const currentExtents = getExtents();
    if (
        x > currentExtents[0] && x < currentExtents[1]
        && y > currentExtents[2] && y < currentExtents[3]
    ) {
        func(canvasCenter[0] + currentOffset[0] + x, canvasCenter[1] + currentOffset[1] - y);
    }
}

function getOffset() {
    return panning ? tempOffset : offset;
};

function getExtents() {
    return panning ? tempExtents : extents;
};

function drawAxes() {
    offset[0] - width / 2
    ctx.moveTo()
}

function toCanvasXY(realX, realY) {
    if (panning) {
        return [tempOffset[0] + realX, tempOffset[1] - realY];
    }
}