import {Diagram} from './index.js'
import { createElements, curveIndexToArrayIndex } from './interactive.js'

let parameters = {
    // "curves": ["cost_curve", "price_floor", "demand_curve", "supply_curve", "AD_curve", "AS_curve"]
    "xlabel": "Q",
    "ylabel": "P",
    "rotated": true,
    // "curves": ["demand_curve", "supply_curve"],
    "curves": [
    // {
    // "type":"demand_curve", "stretch": 1, "shift": 0, "index": 0
    // }, 
    // {
    //     "type":"supply_curve", "stretch": 1, "shift": 0, "index": 0
    // }
    ]
}


const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")


// Adjust canvas dimensions for high-DPI screens
// const devicePixelRatio = window.devicePixelRatio || 1;
// canvas.width = 600;
const divWidth = $("#canvasContainer").width()
console.log("divwidth", divWidth)
canvas.width = divWidth;
canvas.height = divWidth;

// Scale the canvas context based on the device pixel ratio
// ctx.scale(devicePixelRatio, devicePixelRatio);

console.log(canvas.width, canvas.height)

let diagram1 = new Diagram(canvas, parameters, "XLABEL", "YLABEL") 


//Updating Label for Axes (Make it cleaner)
let xaxislabel = "Quantity"
let yaxislabel = "Price"

$("#xaxiseditorbutton").on("click", () => {
    xaxislabel = $("#xlabelname").val()
    parameters[`xlabel`] = xaxislabel
    diagram1.display()
})

$("#yaxiseditorbutton").on("click", () => {
    yaxislabel = $("#ylabelname").val()
    parameters[`ylabel`] = yaxislabel
    diagram1.display()
})


if (!parameters.curves.includes("demand_curve")) {
    $("#demandSliders").addClass("hidden")
}

export function addCurve(curveData) { // TODO: add this into Diagram class
    diagram1.parameters["curves"].push(curveData)
    diagram1.display()
}

export function removeCurve(curveData) { // TODO: add this into Diagram class
    const curveIndex = curveIndexToArrayIndex()
}


$(document).ready(() => {

    // for (const curve of parameters["curves"]) {
    // }
    // createElements(parameters["curves"][0], diagram1)

    $("#singularCurveList").on("click", "li", function () {
        $(this).addClass("singlyselected")
        $(this).siblings().removeClass("singlyselected")

        const curveIndex = parseInt($(this).data("curveindex"))- 1
        const curveType = $(this).data("curveid")

        const curveData = {"index": curveIndex, "type": curveType}
        const curveIndexInArray = curveIndexToArrayIndex(parameters["curves"], curveData)

        createElements(parameters["curves"][curveIndexInArray], diagram1)

        console.log(curveType)
        // console.log("Selected Curve Index:", parseInt($(this).data("curveindex"))- 1)
        
    })

    $("#pairCurveList").on("click", "li", function () {
        $(this).addClass("doublyselected")
        $(this).siblings().removeClass("doublyselected")
    })

    $("#rotatebutton").on("click", () => {
        parameters["rotated"] = !parameters["rotated"] 
        diagram1.display()
    })
    
//     $("#showTR").change((e) => {
//         const checkbox = $("showTR").get() 
//         // const checked = document.getElementById('showTR').checked
//         console.log(checkbox)
//         // if (checked) {
//         //     console.log("hhello it has been checkewd")
//         // } else {
//         //     console.log("goodbye it has been unchecked")
//         // }
//         // console.log($(e.target.id))
//         // const checked = $(this).is(":checked")
//         // if (checked) {
//         //     console.log("OMG")
//         // }
//         // console.log("check if it works for now")
//     })

    diagram1.display()

})