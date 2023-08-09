import { addCurve } from "./visual.js"
import { removeCurve } from "./visual.js"

let sliderData = {
    "demand_curve": {
        "id": "demand_slider",
        "curve_name": "Demand",
        "inputs": ["angle", "shift"],
        "ranges": [[0, 90], [-100, 100]],
        "shorthand": "D"
    },
    "supply_curve": {
        "id": "supply_slider",
        "curve_name": "Supply",
        "inputs": ["angle", "shift"],
        "ranges": [[0, 90], [-100, 100]],
        "shorthand": "S"
    },
    "laffer_curve": {
        "id": "laffer_slider",
        "curve_name": "Laffer",
        "inputs": ["stretch", "shift"],
        "ranges": [[0, 5], [-100, 100]],
        "shorthand": "L"
    }
}

function degreesToSlope(degrees) {
    return Math.tan(degrees*Math.PI/180)
}

export function curveIndexToArrayIndex(curveList, curveData) {
    
    let index = 0
    
    for (const curve of curveList) {
        console.log("checking", curve, "against", curveData)
        if (curve["type"] == curveData["type"] && curve["index"] == curveData["index"]) {
            return index 
        }
        index++
    }
    return -1 
    // "supply_curve", "0" -> 1 
}


export function createElements(curveData, diagram) {

    // $(".sliders").empty()
    $('.sliders').find('*').not('#slidercontainertext').remove()

    const inputs = sliderData[curveData["type"]]["inputs"]
    const ranges = sliderData[curveData["type"]]["ranges"]

    // console.log(inputs, ranges)

    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i]
        const range = ranges[i]
        const ID = `${curveData["type"]}_${input}`
        const divID = ID + "_div"
        const inputID = ID + "_slider"
        const valueID = ID + "_value"
        const labelName = `${sliderData[curveData["type"]]["curve_name"]} ${curveData["index"]+1} ${input}`   

        const minVal = range[0]
        const maxVal = range[1]
        const avgVal = (minVal + maxVal)/2
        const rangeVal = maxVal - minVal

        const parameterArrayIndex = curveIndexToArrayIndex(diagram.parameters["curves"], curveData)

        $('<div>', {
            id: divID
        }).appendTo('.sliders');

        $(`<label>${labelName} </label>`,  {  
            for: labelName
        }).appendTo(`#${divID}`)
        
        $('<input>',  {  
            id: inputID,
            type: "range",
            min: minVal.toString(),
            max: maxVal.toString(),
            value: avgVal.toString(),
            step: rangeVal.toString() / 100.0
            }).appendTo(`#${divID}`)

        $('<input>',  {  
            id: valueID,
            type: "number",
            min: minVal.toString(),
            max: maxVal.toString(),
            value: avgVal.toString()
            }).appendTo(`#${divID}`)
        
        $(`#${inputID}`).on("input", () => {
            const value = $(`#${inputID}`).val()
            
            if (input == "angle") {
                diagram.parameters["curves"][parameterArrayIndex]["stretch"] = degreesToSlope(parseFloat(value)) 
            }
            if (input == "shift") {
                diagram.parameters["curves"][parameterArrayIndex]["shift"] = value
            }
            if (input == "stretch") {
                diagram.parameters["curves"][parameterArrayIndex]["stretch"] = value
            }
            diagram.display()
            $(`#${valueID}`).val($(`#${inputID}`).val())

        })


        $(`#${valueID}`).on("input", () => {
            const value = $(`#${valueID}`).val()
            
            if (input == "angle") {
                diagram.parameters["curves"][parameterArrayIndex]["stretch"] = degreesToSlope(parseFloat(value)) 
            }
            if (input == "shift") {
                diagram.parameters["curves"][parameterArrayIndex]["shift"] = value
            }
            if (input == "stretch") {
                diagram.parameters["curves"][parameterArrayIndex]["stretch"] = value
            }
            diagram.display()
            $(`#${inputID}`).val($(`#${valueID}`).val())
        })


    }
}

function updatePairSelects() {
    const addedCurves = $("#singularCurveList li")
    const addedPairCurves = $("#pairCurveList li")
    

    $("#curvePairListA").empty()
    $("#curvePairListB").empty()

    const allCurveData = []

    for (const addedCurve of addedCurves) {
        const addedCurveElement = $(addedCurve)
        const dataCurveID = addedCurveElement.data("curveid")
        const dataCurveIndex = addedCurveElement.data("curveindex")
        allCurveData.push([dataCurveID, dataCurveIndex])

        const shorthandName = sliderData[dataCurveID]["shorthand"] + dataCurveIndex
        // console.log("adding shorthandname", shorthandName)
        const curveOption = $("<option>", {
            "data-curveid": dataCurveID,
            "data-curveindex": dataCurveIndex,
            text: shorthandName
        })

        $("#curvePairListA").append(curveOption.clone())
        $("#curvePairListB").append(curveOption.clone())
        
    }

    // for (const addedPairCurve of addedPairCurves) {
    //     const curveID_A = addedPairCurve.data("curveid_a")
    //     const curveIndex_A = addedPairCurve.data("curveindex_a")
    //     const curveID_B = addedPairCurve.data("curveid_b")
    //     const curveIndex_B = addedPairCurve.data("curveindex_b")

    //     let deleteFlag = true

    //     for (const curveData of allCurveData) {
    //         const curveID = curveData[0]
    //         const curveIndex = curveData[1]

    //         if (!(curveID_A == curveID && curveIndex == curveIndex_A) && (curveID_B == curveID && curveIndex == curveIndex_B) {

    //         }
    //     }
    // }
    // for (let i =  )
    
    
}



$(document).ready(() => {
    for (const curveName of Object.keys(sliderData)) {
        const curveData = sliderData[curveName]
        const curveOption = $("<option>", {
            value: curveName,
            text: curveData["curve_name"]
        })


        $("#curveList").append(curveOption)
    }


    $("#addCurvePairButton").on("click", () => {
        const curveA = $("#curvePairListA").find(":selected")
        const curveB = $("#curvePairListB").find(":selected")

        const dataCurveID_A = curveA.data("curveid")
        const dataCurveIndex_A = curveA.data("curveindex")
        const textA = curveA.text()

        const dataCurveID_B = curveB.data("curveid")
        const dataCurveIndex_B = curveB.data("curveindex")
        const textB = curveB.text()

        if (!textA || !textB) return
        if (textA == textB) return

        const isDuplicate = $("#pairCurveList li").filter(function () {
            const curveIDA = $(this).data("curveid_a")
            const curveIndexA = $(this).data("curveindex_a")
            const curveIDB = $(this).data("curveid_b")
            const curveIndexB = $(this).data("curveindex_b")
    
            return (curveIDA === dataCurveID_A && curveIndexA === dataCurveIndex_A &&
                    curveIDB === dataCurveID_B && curveIndexB === dataCurveIndex_B)
        }).length > 0
    
        if (isDuplicate) {
            alert("This curve pair is already added loser.")
            return
        }
        
    
        const listElement = $('<li>', {
            "text": `${textA} and ${textB}`,
            "data-curveid_a": dataCurveID_A,
            "data-curveindex_a": dataCurveIndex_A,
            "data-curveid_b": dataCurveID_B,
            "data-curveindex_b": dataCurveIndex_B

        })
        listElement.on("mousedown", (e) => {
            if (e.which == 3) {
                // removeCurve()
                listElement.remove()
                updatePairSelects()
            }
        })
        $("#pairCurveList").append(listElement)
    })

    $("#addCurveButton").on("click", () => {
        const selectedCurve = $("#curveList").val()
        const addedCurves = $("#singularCurveList li")

        let largestCurveIndex = 0

        for (const addedCurve of addedCurves) {
            const addedCurveElement = $(addedCurve)
            const dataCurveID = addedCurveElement.data("curveid")
            const dataCurveIndex = addedCurveElement.data("curveindex")
            if (selectedCurve == dataCurveID) {
                if (dataCurveIndex > largestCurveIndex) {
                    largestCurveIndex = dataCurveIndex 
                }           
            }

        }
        largestCurveIndex += 1
        
        const curveData = {
            "type": selectedCurve,
            "stretch": 1,
            "shift": 0,
            "index": largestCurveIndex-1
        }
        addCurve(curveData)

        const listElement = $('<li>', {
            "data-curveid": selectedCurve,
            "data-curveindex": largestCurveIndex,
            "text": sliderData[selectedCurve]["curve_name"] + " Curve " + largestCurveIndex,
        })

        listElement.on("mousedown", (e) => {
            if (e.which == 3) {
                listElement.remove()
                updatePairSelects()
            }
        })
        listElement.appendTo('#singularCurveList')

        updatePairSelects()
        
    })
    
    // $("#singularCurveList").on("click", "li", function () {
    //     $(this).addClass("singlyselected")
    //     $(this).siblings().removeClass("singlyselected")

    //     console.log("Selected Curve Index:", $(this).data("curveindex"))
        
    // });

    // $("#pairCurveList").on("click", "li", function () {
    //     $(this).addClass("doublyselected")
    //     $(this).siblings().removeClass("doublyselected")
    // });

    $("#downloadbtn").on("click", () => {
        var canvas = document.querySelector("#canvas")
        var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
        
        var element = document.createElement('a')
        var filename = 'test.png'
        element.setAttribute('href', image)
        element.setAttribute('download', filename)
        element.style.display = 'none'
        
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
    })

})