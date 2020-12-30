const squareViewportSide = 1000;
const R = 1000/3 /2; // view port "unit" radius
const initialClockFace = 333;
const maxZoom = R * Math.tan(75 * Math.PI / 180);

var zoom = 0;
var timeAngleRadians = 0;

// alpha is angle between diameter and zoom projection line
function getAlpha() {
    return Math.atan(zoom/R);
}

// center offset is distance between viewport center and clock face center
function getCenterOffset(){
    return Math.sin(getAlpha()) * R;
}

// half length of clock face chord placed on viewport diameter
function getHalfChord() {
    return Math.cos(getAlpha()) * R;
}

// delta x is offset in x direction 
function getDeltaX() {
    return Math.cos(timeAngleRadians) * getCenterOffset();
}

// delta y is offset in y direction
function getDeltaY() {
    return Math.sin(timeAngleRadians) * getCenterOffset();
}

// dilation is scaling multiplier
function getDilation() {
    return R/getHalfChord();
}

const clockFace = document.getElementById("clockFace");
const faceContainer = document.getElementById("faceContainer");

const outputZoom = document.getElementById("outputZoom");
const outputTime = document.getElementById("outputTime");

const zoomSlider = document.getElementById("zoom");
zoomSlider.oninput = function() {
    zoom = this.value;
    outputZoom.innerHTML = zoom;

    const newFaceSideLength = Math.floor(initialClockFace * getDilation());
    clockFace.style.width = `${newFaceSideLength}px`;
    clockFace.style.height = `${newFaceSideLength}px`;
    updateTranslation();
}

const timeSlider = document.getElementById("time");
timeSlider.oninput = function () {
    timeAngleRadians = this.value * Math.PI / 180;
    outputTime.innerHTML = this.value;

    updateTranslation();
}

function updateTranslation() {
    const dx = Math.floor(getDeltaX() * getDilation());
    const dy = Math.floor(getDeltaY() * getDilation());
    faceContainer.style.left = `${200-dx}px`;
    faceContainer.style.top = `${200+dy}px`;
}
