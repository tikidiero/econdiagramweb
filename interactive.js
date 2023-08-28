import { addCurve, removeCurve, getDiagram } from "./visual.js"

const CURVE_DATA = {
    "demand_curve": {
        "id": "demand_slider",
        "curve_name": "Demand",
        "shorthand": "D",
        "type": "curve"
    },
    "supply_curve": {
        "id": "supply_slider",
        "curve_name": "Supply",
        "shorthand": "S",
        "type": "curve"
    },
    "laffer_curve": {
        "id": "laffer_slider",
        "curve_name": "Laffer",
        "shorthand": "L",
        "type": "curve"
    },
    "alongcurve": {
        "curve_name": "Along Curve",
        "type": "point"
    }, 
    "intersection": {
        "curve_name": "Intersection",
        "type": "point"
    },
    "coordinates": {
        "curve_name": "Coordinates",
        "type": "point"
    }

}

const sliderData = {
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
    $('.editor').find('*').not('#slidercontainertext').remove()
}



export function encodeHTMLData(object) {
    return encodeURI(JSON.stringify(object))
}

export function decodeHTMLData(text) {
    return JSON.parse(decodeURI(text))

}


function isSameCurve(curveData1, curveData2) {
    return curveData1["type"] === curveData2["type"] && curveData1["index"] === curveData2["index"]
}

function findSameCurve(curveDatas, matchCurveData) {
    for (const curveData of curveDatas) {
        if (isSameCurve(curveData, matchCurveData)) {
            return curveData 
        }
    }
}

function  updatePointToDiagram() {
    const diagram = getDiagram()
    const pointsList = $("pointsList")
    for (const pointHTML of pointsList) {
        const newPointsList = []

        const targetCurve = decodeHTML(pointHTML.data("targetcurve"))
        console.log(targetCurve)
    }
}

function generateSliderInputCombo(labelName, minVal, maxVal, currVal, targetCurveData, inputType, className) {
    const rangeVal = Math.abs(maxVal - minVal)

    const label = $(`<label>${labelName} </label>`,  {  
        for: labelName
    })
    
    const slider = $('<input>',  {  
        class: className,
        type: "range",
        min: minVal.toString(),
        max: maxVal.toString(),
        value: currVal.toString(),
        step: rangeVal.toString() / 100.0,
        "data-targetcurve": encodeHTMLData(targetCurveData),
        "data-inputtype": inputType
    })

    const number = $('<input>',  {  
        class: className,
        type: "number",
        min: minVal.toString(),
        max: maxVal.toString(),
        value: currVal.toString(),
        "data-targetcurve": encodeHTMLData(targetCurveData),
        "data-inputtype": inputType
    })
    return [label, slider, number]
    
}

$(document).ready(() => {
    for (const curveName of Object.keys(CURVE_DATA)) {

        if (CURVE_DATA[curveName]["type"] == "curve"){
        
        const curveData = CURVE_DATA[curveName]
        const curveOption = $("<option>", {
            value: curveName,
            text: CURVE_DATA[curveName]["curve_name"]
        })

        $("#curveList").append(curveOption)
    }
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
        const targetPointData = decodeHTMLData($(this).data("targetpoint"))
        console.log("interactive data")
        console.table(interactiveData)
        
        for (const elementData of interactiveData) {
            
            const editorDiv = $('<div>').appendTo('.editor');
            
            if (elementData["type"] === "sliderInputCombo") {

                const curveData = elementData["data"]
                const range = elementData["range"]
                const input = elementData["input"]
    
                const labelName = `${CURVE_DATA[curveData["type"]]["curve_name"]} ${curveData["index"]+1} ${input}`
        
                const minVal = range[0]
                const maxVal = range[1]
                const rangeVal = maxVal - minVal
                const currVal = targetCurveData[input]
       
                const inputElements = generateSliderInputCombo(labelName, minVal, maxVal, currVal, curveData, input, "variableInput")

                for (const inputElement of inputElements) {
                    inputElement.appendTo(editorDiv)
                }

                        
                
            } else if (elementData["type"] === "radio") {
                const inputData = elementData["input"]
                console.log(targetCurveData)
                console.log(targetCurveData["points"])
                const radioName = "radio"

                for (const radioData of inputData){
                    const labelName = radioData
            
                    $(`<label>`, {
                        for: labelName,
                        text: CURVE_DATA[radioData]["curve_name"],
                    }).appendTo(editorDiv)
                    
                    $('<input>',  {  
                        name: radioName,
                        id: labelName, 
                        class: "toggleableInput",
                        type: "radio",
                        
                        "data-inputtype": radioData
                    }).appendTo(editorDiv)
                    
                    
                }

            }
        }

    })

    $(document).on("input", ".toggleableInput", function() {
        
        $(".editoreditor").remove()
        
        const inputType = $(this).data("inputtype")

        const radioInput = {
        "alongcurve": 
            generateSliderInputCombo("Along The Curve", 0, 100, 50, "", "alongCurve", "pointsVariableInput")
                .concat($("<select>", {
                    class: "allCurveDropdown",
                    id: "alongCurveDropdown"
                }
        )),
        "intersection": [
            $("<select>", {
                class: "allCurveDropdown intersection",
                id: "curve1"
            }), 
            $("<p>", {
                text: " and ",
                style: "display: inline;"
            }),
            $("<select>", {
                class: "allCurveDropdown intersection",
                id: "curve2"
            })
        ], 
        "coordinates":
            generateSliderInputCombo("X coordinate", 0, 100, 50, "", "coordinateX", "pointsVariableInput")
                .concat($("<br/>"))
                .concat(generateSliderInputCombo("Y coordinate", 0, 100, 50, "", "coordinateY", "pointsVariableInput"))
        }

        const generateInputs = radioInput[inputType]
        const newInputsDiv =  $("<div>", {
            "class": "editoreditor"
        })
        for (const generateInput of generateInputs) {
            generateInput.appendTo(newInputsDiv)
        }
        newInputsDiv.appendTo(".editor")
        
        $("#curveList").trigger("curves:change")

        const selectedClassData = decodeHTMLData($(".selectedElement").data("targetcurve"))
        console.log("selectedClass", selectedClassData)
        console.log("active before: ", selectedClassData["active"])
        selectedClassData["active"] = inputType
        console.log("active after: ", selectedClassData["active"])
        $(".selectedElement").data("targetcurve", encodeHTMLData(selectedClassData))

    })


    $(document).on("input", "#alongCurveDropdown", function() {

        const selectedClassData = decodeHTMLData($(".selectedElement").data("targetcurve"))
        selectedClassData["alongcurve"]["curve1"] = $("#alongCurveDropdown").val()
        $(".selectedElement").data("targetcurve", encodeHTMLData(selectedClassData))

    })

    $(document).on("input", ".intersection", function() {

        const id = $(this).attr("id")

        const selectedClassData = decodeHTMLData($(".selectedElement").data("targetcurve"))
        selectedClassData["intersection"][id] = $("#"+id).val()
        $(".selectedElement").data("targetcurve", encodeHTMLData(selectedClassData))

    })

    $(document).on("input", "pointsVariableInput", function() {

        const newVal = parseFloat($(this).val())

        const curveData = decodeHTMLData($(this).data("targetpoint"))
        const inputType = $(this).data("inputtype")

        const selectedClassData = decodeHTMLData($(".selectedElement").data("targetpoint"))

        if (inputType == "coordinateX"){ // points 
            
            selectedClassData["coordinate"]["x"] = newVal
            $(".selectedElement").data("targetpoint", encodeHTMLData(selectedClassData))
        }

        if (inputType == "coordinateY"){
            selectedClassData["coordinate"]["y"] = newVal
            $(".selectedElement").data("targetpoint", encodeHTMLData(selectedClassData))
        }

        if (inputType == "alongCurve"){
            selectedClassData["alongcurve"]["t"] = newVal/100
            $(".selectedElement").data("targetpoint", encodeHTMLData(selectedClassData))
        }

    })

    $(document).on("input", ".variableInput", function() {

        const newVal = parseFloat($(this).val())

        const curveData = decodeHTMLData($(this).data("targetcurve"))
        const inputType = $(this).data("inputtype")

        const selectedClassData = decodeHTMLData($(".selectedElement").data("targetcurve"))

        let sameInputTypes = []

        for (const variableInput of $(".variableInput")) {
            if ($(variableInput).data("inputtype") === inputType) { 
                sameInputTypes.push(variableInput)
            }
        }
        for (const variableInput of sameInputTypes) {
            $(variableInput).val(newVal)
        }


        if (curveData !== "") { // shifting stuff
            
            const allCurves = $("#singularCurveList li")
            for (const curveHTML of allCurves) {
                // console.log(curveHTML)
                const listCurveData = decodeHTMLData($(curveHTML).data("targetcurve"))
                
                if (isSameCurve(listCurveData, curveData)) { 
                
                    listCurveData[inputType] = newVal
                    $(curveHTML).data("targetcurve", encodeHTMLData(listCurveData))

                }

                const diagram = getDiagram()
                const diagramCurveData = findSameCurve(diagram.parameters.curves, curveData)

                if (inputType === "angle") {
                    diagramCurveData["stretch"] = degreesToSlope(newVal)
                } else {

                    diagramCurveData[inputType] = newVal
                }

                diagram.display()
        }
        }

        
    })




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
        },{
            "input": "stretch",
            "type": "sliderInputCombo", // "slider", "input", "checkbox", "radio", ...
            "range": sliderData["stretch"],
            "data": curveData  
        }
    ]
    
    
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
            $("#curveList").trigger("curves:change")
            // updatePairSelects()
        }
    })
    listElement.appendTo('#singularCurveList')
    $("#curveList").trigger("curves:change")
    
    
})

    $("#curveList").on("curves:change", function () {

        const addedCurves = $("#singularCurveList li")

        const curveOptions = []

        for (const addedCurve of addedCurves) {
            const addedCurveElement = $(addedCurve)
            const targetCurveData = decodeHTMLData(addedCurveElement.data("targetcurve"))

            const shorthandName = CURVE_DATA[targetCurveData["type"]]["shorthand"] + (targetCurveData["index"]+1)
            // console.log("adding shorthandname", shorthandName)
            const curveOption = $("<option>", {
                "data-targetcurve": encodeHTMLData(targetCurveData),
                text: shorthandName
            })
            curveOptions.push(curveOption)

            // $("#curvePairListB").append(curveOption.clone())
            
        }


        for (const dropdown of $(".allCurveDropdown")) {
            $(dropdown).empty()
            for (const curveOption of curveOptions) {
                $(dropdown).append(curveOption.clone())
            }
        }

    })

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


        const addedPoints = $("#pointsList li")

        let largestPointIndex = -1

        for (const addedPoint of addedPoints) {
            const addedPointElement = $(addedPoint)
            const targetPointData = decodeHTMLData(addedPointElement.data("targetpoint")) //CHANGE "targetcurve" TO "targetpoint". DOES NOT WORK BECAUSE OF ENCODEHTML.
            const pointIndex = targetPointData["index"]
            // const pointType = targetPointData["type"]
        
            if (pointIndex > largestPointIndex) {
                largestPointIndex = pointIndex 
            }           
            

        }
        largestPointIndex += 1

        const pointData = {
            "index": largestPointIndex,
            "coordinate": {"x": 1, "y": 54}, 
            "intersection": {"curve1": "D1", "curve2": "D2"}, 
            "alongcurve": {"t": 0.58, "curve1": "D1"},
            "active": "coordinate"
        }

        const interactiveData = [{
            "input": ["alongcurve", "intersection", "coordinates"],
            "type": "radio"
        }]

        const element = $('<li>', {
            "data-interactivedata": encodeHTMLData(interactiveData),
            "data-targetpoint": encodeHTMLData(pointData),
            "text": "Point" + (largestPointIndex+1),
            "class": "selectable"
        })
        element.appendTo("#pointsList")

        element.on("mousedown", (e) => {
            if (e.which == 3) {

                element.remove()
            }
        })

    })

})