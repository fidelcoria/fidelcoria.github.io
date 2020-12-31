const squarePlateSide = 600;
const viewportDiameter = squarePlateSide / 3;
const viewportRadius = viewportDiameter / 2;
const maxZoom = viewportRadius * Math.tan(55 * Math.PI / 180);

var zoom = 0;
var timeAngleRadians = 0;

// alpha is angle between diameter and zoom projection line
const getAlpha = (z) =>
    Math.atan(z/viewportRadius);

// center offset is distance between viewport center and clock face center
const getCenterOffset = (z) =>
    Math.sin(getAlpha(z)) * viewportRadius;

// half length of clock face chord placed on viewport diameter
const getHalfChord = (z) =>
    Math.cos(getAlpha(z)) * viewportRadius;

// delta x is offset in x direction 
const getDeltaX = (t, z) =>
    Math.cos(t) * getCenterOffset(z);

// delta y is offset in y direction
const getDeltaY = (t, z) =>
    Math.sin(t) * getCenterOffset(z);

// dilation is scaling multiplier
const getDilation = (z) =>
    viewportRadius/getHalfChord(z);

const faceContainerSide = Math.ceil(viewportDiameter * getDilation(maxZoom))
const faceContainerInitialOffset = Math.floor((squarePlateSide - faceContainerSide) / 2);

const clockFace = document.getElementById("clockFace");
const hourHand = document.getElementById("hourHand");
const faceContainer = document.getElementById("faceContainer");
const hourHandContainer = document.getElementById("hourHandContainer");

// INITIALIZE SIZES
document.getElementById("wrapper").style.width = squarePlateSide
document.getElementById("wrapper").style.height = squarePlateSide
faceContainer.style.left = `${faceContainerInitialOffset}px`
faceContainer.style.top = `${faceContainerInitialOffset}px`
faceContainer.style.minWidth = `${faceContainerSide}px`
faceContainer.style.minHeight = `${faceContainerSide}px`
hourHandContainer.style.left = `${faceContainerInitialOffset}px`
hourHandContainer.style.top = `${faceContainerInitialOffset}px`
hourHandContainer.style.minWidth = `${faceContainerSide}px`
hourHandContainer.style.minHeight = `${faceContainerSide}px`
clockFace.style.width = `${viewportDiameter}px`
clockFace.style.height = `${viewportDiameter}px`
hourHand.style.width = `${viewportDiameter}px`
hourHand.style.height = `${viewportDiameter}px`
document.getElementById("viewportContainer").style.width = `${squarePlateSide}px`
document.getElementById("viewportContainer").style.height = `${squarePlateSide}px`
document.getElementById("clockViewport").style.width = `${squarePlateSide}px`
document.getElementById("clockViewport").style.height = `${squarePlateSide}px`
document.getElementById("zoom").setAttribute("max", `${maxZoom}`)
// END INITIALIZE SIZES

const outputZoom = document.getElementById("outputZoom");
const outputTime = document.getElementById("outputTime");

const zoomSlider = document.getElementById("zoom");
zoomSlider.oninput = function() {
    zoom = this.value;
    applyDilationToClockFace(zoom);
    updateTranslation(timeAngleRadians, zoom);
}

function applyDilationToClockFace(z) {
    outputZoom.innerHTML = z;

    const newFaceSideLength = Math.floor(viewportDiameter * getDilation(z));
    clockFace.style.width = `${newFaceSideLength}px`;
    clockFace.style.height = `${newFaceSideLength}px`;
    hourHand.style.width = `${newFaceSideLength}px`;
    hourHand.style.height = `${newFaceSideLength}px`;
}

const timeSlider = document.getElementById("time");
timeSlider.oninput = function () {
    timeAngleRadians = (360-this.value) * Math.PI / 180;
    outputTime.innerHTML = this.value;
    
    applyTimeToHourHand((360-this.value));
    updateTranslation(timeAngleRadians, zoom);
}

function applyTimeToHourHand(tDeg) {

    const hourHandRotate = 90-tDeg;
    document.getElementById("hourHand").style.transform = `rotate(${hourHandRotate}deg)`
}

function updateTranslation(t, z) {
    const dx = Math.floor(getDeltaX(t, z) * getDilation(z));
    const dy = Math.floor(getDeltaY(t, z) * getDilation(z));
    faceContainer.style.left = `${faceContainerInitialOffset-dx}px`;
    faceContainer.style.top = `${faceContainerInitialOffset+dy}px`;
    hourHandContainer.style.left = `${faceContainerInitialOffset-dx}px`;
    hourHandContainer.style.top = `${faceContainerInitialOffset+dy}px`;
}

/// custom init update
applyDilationToClockFace(100);
applyTimeToHourHand(0);
updateTranslation(0, 100);

// workaround for zoom rendering
zoom = 100;
zoomSlider.setAttribute("value", "100");