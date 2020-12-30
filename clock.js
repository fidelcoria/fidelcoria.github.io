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
const faceContainer = document.getElementById("faceContainer");

// INITIALIZE SIZES
document.getElementById("wrapper").style.width = squarePlateSide
document.getElementById("wrapper").style.height = squarePlateSide
faceContainer.style.left = `${faceContainerInitialOffset}px`
faceContainer.style.top = `${faceContainerInitialOffset}px`
faceContainer.style.minWidth = `${faceContainerSide}px`
faceContainer.style.minHeight = `${faceContainerSide}px`
clockFace.style.width = `${viewportDiameter}px`
clockFace.style.height = `${viewportDiameter}px`
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
    outputZoom.innerHTML = zoom;

    const newFaceSideLength = Math.floor(viewportDiameter * getDilation(zoom));
    clockFace.style.width = `${newFaceSideLength}px`;
    clockFace.style.height = `${newFaceSideLength}px`;
    updateTranslation();
}

const timeSlider = document.getElementById("time");
timeSlider.oninput = function () {
    timeAngleRadians = this.value * Math.PI / 180;
    outputTime.innerHTML = this.value;
    const hourHandRotate = -this.value;
    document.getElementById("hourHand").style.transform = `rotate(${hourHandRotate}deg)`

    updateTranslation();
}

function updateTranslation() {
    const dx = Math.floor(getDeltaX(timeAngleRadians, zoom) * getDilation(zoom));
    const dy = Math.floor(getDeltaY(timeAngleRadians, zoom) * getDilation(zoom));
    faceContainer.style.left = `${faceContainerInitialOffset-dx}px`;
    faceContainer.style.top = `${faceContainerInitialOffset+dy}px`;
}
