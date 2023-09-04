import {Diagram} from './index.js'
import { curveIndexToArrayIndex, clearSliders, encodeHTMLData, decodeHTMLData } from './interactive.js'

export let parameters = {
    // "curves": ["cost_curve", "price_floor", "demand_curve", "supply_curve", "AD_curve", "AS_curve"]
    "xlabel": "Q",
    "ylabel": "P",
    "rotated": true,
    // "curves": ["demand_curve", "supply_curve"],
    "curves": [
    ],
    "points": [ 
        {
        "coordinate": {"x": 50, "y": 50}, 
        // "intersection": [curveData1, curveData2], 
        "alongcurve": {"t": 0.58, "curve1": "D1"},
        "active": "coordinate",
        "index": 1
        }
]
}

// let curveEditorData = {
//     "demand":{"comboset": 2, "pair": ["TR", "CS", "PS"]},
//     "supply":{"comboset": 2, "pair": ["TR", "CS"]},
//     "AD": {"comboset": 2, "pair": ["DWL"]}

// }


const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")


// Adjust canvas dimensions for high-DPI screens
// const devicePixelRatio = window.devicePixelRatio || 1;
// canvas.width = 600;
const divWidth = $("#canvasContainer").width()
canvas.width = divWidth;
canvas.height = divWidth;


// Scale the canvas context based on the device pixel ratio
// ctx.scale(devicePixelRatio, devicePixelRatio);

console.log(canvas.width, canvas.height)

let diagram1 = new Diagram(canvas, parameters, "XLABEL", "YLABEL") 

export function getDiagram()  {
    return diagram1
}


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
    const curveIndex = curveIndexToArrayIndex(diagram1.parameters["curves"], curveData)
    const selectedCurves = $(".selectedElement")

    for (const selectedCurve of selectedCurves) {
        const selectedCurveElement = $(selectedCurve)
        const selectedCurveData = decodeHTMLData(selectedCurveElement.data("targetcurve"))
        const selectedCurveType = selectedCurveData["type"]
        const selectedCurveIndex = selectedCurveData["index"]

        if (curveData["type"] == selectedCurveType && curveData["index"] == selectedCurveIndex) {
            clearSliders()
        }
        
    }
    diagram1.parameters["curves"].splice(curveIndex, 1)
    diagram1.display()

}


$(document).ready(() => {


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

$(document).ready(() =>{
    $(document).on("input", ".variableInput", function() {
        // console.log("parameters ", parameters)
    })
})