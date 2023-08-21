import { addCurve } from "./visual.js"
import { removeCurve } from "./visual.js"

const CURVE_DATA = {
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

let sliderData = {
    "angle": [0, 90],
    "shift": [-100, 100],
    "stretch": [0, 5]
}

function degreesToSlope(degrees) {
    return Math.tan(degrees*Math.PI/180)
}

function slopeToDegrees(slope) {
    return Math.atan(slope) * 180/Math.PI
}

export function curveIndexToArrayIndex(curveList, curveData) {
    
    let index = 0
    
    for (const curve of curveList) {
        // console.log("checking", curve, "against", curveData)
        if (curve["type"] == curveData["type"] && curve["index"] == curveData["index"]) {
            return index 
        }
        index++
    }
    return -1 
    // "supply_curve", "0" -> 1 
}


export function clearSliders() {
    $('.sliders').find('*').not('#slidercontainertext').remove()
}

export function createElementsPoints(curveData, diagram) {
    
}

export function createElements(curveData, diagram) {

    // $(".sliders").empty()
    clearSliders()

    console.log("sldieradatA", sliderData)
    console.log("curveDAta", curveData)
    
    const inputs = sliderData[curveData["type"]]["inputs"] //Types of inputs
    const ranges = sliderData[curveData["type"]]["ranges"] //Ranges for the input values


    console.log("undefined", inputs, ranges)

    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i]
        const range = ranges[i]
        const ID = `${curveData["type"]}_${input}`
        const divID = ID + "_div"
        const inputID = ID + "_slider"
        const valueID = ID + "_value"
        const labelName = `${sliderData[curveData["type"]]["curve_name"]} ${curveData["index"]+1} ${input}`   

        const parameterArrayIndex = curveIndexToArrayIndex(diagram.parameters["curves"], curveData)

        let currInputValue
        if (input === "angle") {
            currInputValue = slopeToDegrees(diagram.parameters["curves"][parameterArrayIndex]["stretch"])
        } else {
            currInputValue = diagram.parameters["curves"][parameterArrayIndex][input]
        }
        

        const minVal = range[0]
        const maxVal = range[1]
        const currVal = currInputValue ? currInputValue : (minVal + maxVal)/2
        const rangeVal = maxVal - minVal




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
            value: currVal.toString(),
            step: rangeVal.toString() / 100.0
            }).appendTo(`#${divID}`)

        $('<input>',  {  
            id: valueID,
            type: "number",
            min: minVal.toString(),
            max: maxVal.toString(),
            value: currVal.toString()
            }).appendTo(`#${divID}`)
        
        // $(`#${inputID}`).on("input", () => {
        //     const value = $(`#${inputID}`).val()
            
        //     if (input == "angle") {
        //         diagram.parameters["curves"][parameterArrayIndex]["stretch"] = degreesToSlope(parseFloat(value)) 
        //     }
        //     if (input == "shift") {
        //         diagram.parameters["curves"][parameterArrayIndex]["shift"] = value
        //     }
        //     if (input == "stretch") {
        //         diagram.parameters["curves"][parameterArrayIndex]["stretch"] = value
        //     }
        //     diagram.display()
        //     $(`#${valueID}`).val($(`#${inputID}`).val())

        // })


        // $(`#${valueID}`).on("input", () => {
        //     const value = $(`#${valueID}`).val()
            
        //     if (input == "angle") {
        //         diagram.parameters["curves"][parameterArrayIndex]["stretch"] = degreesToSlope(parseFloat(value)) 
        //     }
        //     if (input == "shift") {
        //         diagram.parameters["curves"][parameterArrayIndex]["shift"] = value
        //     }
        //     if (input == "stretch") {
        //         diagram.parameters["curves"][parameterArrayIndex]["stretch"] = value
        //     }
        //     diagram.display()
        //     $(`#${inputID}`).val($(`#${valueID}`).val())
        // })


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

    
}


export function encodeHTMLData(object) {
    return encodeURI(JSON.stringify(object))
}

export function decodeHTMLData(text) {
    return JSON.parse(decodeURI(text))

}


$(document).ready(() => {
    for (const curveName of Object.keys(CURVE_DATA)) {
        
        const curveData = CURVE_DATA[curveName]
        const curveOption = $("<option>", {
            value: curveName,
            text: CURVE_DATA[curveName]["curve_name"]
        })

        $("#curveList").append(curveOption)
    }


    $(document).on("click", ".selectable", () => {
        clearSliders()

        // handle slider generation via list element's data
    })

    
    $(document).on("click", ".selectable", function () {
        $('*').removeClass("selectedElement")
        $(this).addClass("selectedElement")
        const interactiveData = decodeHTMLData($(this).data("interactivedata"))
        const targetCurveData = decodeHTMLData($(this).data("targetcurve"))

        for (const elementData of interactiveData) {

            
            if (elementData["type"] === "sliderInputCombo") {

                const curveData = elementData["data"]
                const range = elementData["range"]
                const input = elementData["input"]

    
                console.table(elementData)


                const ID = `${curveData["type"]}_${input}`
                const divID = ID + "_div"
                const inputID = ID + "_slider"
                const valueID = ID + "_value"
                const labelName = `${CURVE_DATA[curveData["type"]]["curve_name"]} ${curveData["index"]+1} ${input}`
        
                // const parameterArrayIndex = curveIndexToArrayIndex(diagram.parameters["curves"], curveData)
        
                // let currInputValue
                // if (input === "angle") {
                //     currInputValue = slopeToDegrees(diagram.parameters["curves"][parameterArrayIndex]["stretch"])
                // } else {
                //     currInputValue = diagram.parameters["curves"][parameterArrayIndex][input]
                // }
        
                const minVal = range[0]
                const maxVal = range[1]
                // const currVal = currInputValue ? currInputValue : (minVal + maxVal)/2
                console.log(targetCurveData)
                const rangeVal = maxVal - minVal
                const currVal = targetCurveData[input]
        
        
        
                $('<div>', {
                    id: divID
                }).appendTo('.sliders');
        
                $(`<label>${labelName} </label>`,  {  
                    for: labelName
                }).appendTo(`#${divID}`)
                
                $('<input>',  {  
                    class: "variableInput",
                    type: "range",
                    min: minVal.toString(),
                    max: maxVal.toString(),
                    value: currVal.toString(),
                    step: rangeVal.toString() / 100.0,
                    "data-targetcurve": encodeHTMLData(curveData),
                    "data-inputtype": input
                }).appendTo(`#${divID}`)
        
                $('<input>',  {  
                    class: "variableInput",
                    type: "number",
                    min: minVal.toString(),
                    max: maxVal.toString(),
                    value: currVal.toString(),
                    "data-targetcurve": encodeHTMLData(curveData),
                    "data-inputtype": input
                }).appendTo(`#${divID}`)
                        
                
            } else if (false) {
                console.log("radio box")
            }
        }

    })


    $(document).on("input", ".variableInput", function() {

        const newVal = $(this).val()

        const curveData = decodeHTMLData($(this).data("targetcurve"))
        const inputType = $(this).data("inputtype")


        const allCurves = $("#singularCurveList li")
        for (const curveHTML of allCurves) {
            // console.log(curveHTML)
            const listCurveData = decodeHTMLData($(curveHTML).data("targetcurve"))
            if (listCurveData["type"] === curveData["type"] && listCurveData["index"] === curveData["index"]) { 
            
                listCurveData[inputType] = parseFloat(newVal)
                $(curveHTML).data("targetcurve", encodeHTMLData(listCurveData))

                const sameInputTypes = $(".variableInput").filter((HTMLobj) => {
                    return $(HTMLobj).data("inputtype") === inputType
                })

                console.log(sameInputTypes)

                for (const sameInputType of sameInputTypes) {
                    console.log((sameInputType))
                }


    
            }
            // console.log(listCurveData)
        }
        
        
        // console.log("shift", curveData["shift"])

        // console.table(curveData)
        // console.log(inputType)
    })


    // $(`.updateCurveInfo`).on("input", () => {
    //     const value = $(`#${valueID}`).val()
        
    //     if (input == "angle") {
    //         diagram.parameters["curves"][parameterArrayIndex]["stretch"] = degreesToSlope(parseFloat(value)) 
    //     }
    //     if (input == "shift") {
    //         diagram.parameters["curves"][parameterArrayIndex]["shift"] = value
    //     }
    //     if (input == "stretch") {
    //         diagram.parameters["curves"][parameterArrayIndex]["stretch"] = value
    //     }
    //     diagram.display()
    //     $(`#${inputID}`).val($(`#${valueID}`).val())
    // })

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
            alert("This curve pair is already added.")
            return
        }
        
    
        const listElement = $('<li>', {
            "text": `${textA} and ${textB}`,
            "data-curveid_a": dataCurveID_A,
            "data-curveindex_a": dataCurveIndex_A,
            "data-curveid_b": dataCurveID_B,
            "data-curveindex_b": dataCurveIndex_B,
            "class": "selectable"

        })
        listElement.on("mousedown", (e) => {
            if (e.which == 3) {

                listElement.remove()
                updatePairSelects()
            }
        })
        $("#pairCurveList").append(listElement)
    })

    $("#addCurveButton").on("click", () => {
        const selectedCurveType = $("#curveList").val()
        const addedCurves = $("#singularCurveList li")

        let largestCurveIndex = -1

        for (const addedCurve of addedCurves) {
            const addedCurveElement = $(addedCurve)
            const targetCurveData = decodeHTMLData(addedCurveElement.data("targetcurve"))
            const curveIndex = targetCurveData["index"]
            const curveType = targetCurveData["type"]

            if (selectedCurveType == curveType) {
                if (curveIndex > largestCurveIndex) {
                    largestCurveIndex = curveIndex 
                }           
            }

        }
        largestCurveIndex += 1
        
        const curveData = {
            "type": selectedCurveType,
            "stretch": 1,
            "shift": 0,
            "angle": 45,
            "index": largestCurveIndex
        }
        console.log(curveData)
        addCurve(curveData)

        // const listElement = $('<li>', {
        //     "data-curveid": selectedCurve,
        //     "data-curveindex": largestCurveIndex,
        //     "text": sliderData[selectedCurve]["curve_name"] + " Curve " + largestCurveIndex,
        //     "class": "selectable"
        // })

        const interactiveData = [{
            "input": "shift",
            "type": "sliderInputCombo", // "slider", "input", "checkbox", "radio", ...
            "range": sliderData["shift"],
            "data": curveData
        },{
            "input": "angle",
            "type": "sliderInputCombo", // "slider", "input", "checkbox", "radio", ...
            "range": sliderData["angle"],
            "data": curveData 
        }]


        const listElement = $('<li>', {
            "data-interactivedata": encodeHTMLData(interactiveData),
            "data-targetcurve": encodeHTMLData(curveData),
            "text": CURVE_DATA[selectedCurveType]["curve_name"] + " Curve " + (largestCurveIndex+1),
            "class": "selectable"
        })

        listElement.on("mousedown", (e) => {
            if (e.which == 3) {
                const curveDataDelete = {
                    "type": selectedCurveType,
                    "index": largestCurveIndex
                }
                console.log("REMOVING", curveDataDelete)
                removeCurve(curveDataDelete)
                listElement.remove()
                // updatePairSelects()
            }
        })
        listElement.appendTo('#singularCurveList')

        // const element = document.createElement('option')
        // element.textContent= sliderData[selectedCurve]["curve_name"] + " Curve " + largestCurveIndex

        // document.getElementById("curvesforpoints").appendChild(element)

        // updatePairSelects()
        
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
        let canvas = document.querySelector("#canvas")
        let image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
        
        let element = document.createElement('a')
        let filename = 'test.png'
        element.setAttribute('href', image)
        element.setAttribute('download', filename)
        element.style.display = 'none'
        
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
    })

    $("#addpointbutton").on("click", () => {
    
        // const selectedCurve = $(".singlyselected")[0]
        // const selectedCurveElement = $(selectedCurve)
        // const selectedCurveIndex = parseInt(selectedCurveElement.data("curveindex"))-1
        // const selectedCurveType = selectedCurveElement.data("curveid")
        // const shorthandName = sliderData[selectedCurveType]["shorthand"] + (selectedCurveIndex+1)
        // const pointName = "P1"
        // const pointText = `${pointName} on ${shorthandName}`

        // let element = $('<li>', {
        //     text: pointText,
        //     "data-boundTotype": selectedCurveType,
        //     "data-boundtoindex": selectedCurveIndex 
        // })

        let element = $('<li>', {
            text: "P1",
            "class": "selectable"
        })
        element.appendTo("#pointsList")

    })

})