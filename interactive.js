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


export function createElements(curveName, diagram) {


    const inputs = sliderData[curveName]["inputs"]
    const ranges = sliderData[curveName]["ranges"]

    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i]
        const range = ranges[i]
        const ID = `${curveName}_${input}`
        const divID = ID + "_div"
        const inputID = ID + "_slider"
        const valueID = ID + "_value"
        const labelName = `${sliderData[curveName]["curve_name"]} ${input}`   

        const minVal = range[0]
        const maxVal = range[1]
        const avgVal = (minVal + maxVal)/2
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
                diagram.parameters[`${curveName}_stretch`] = degreesToSlope(parseFloat(value)) 
            }
            if (input == "shift") {
                diagram.parameters[`${curveName}_shift`] = value
            }
            if (input == "stretch") {
                diagram.parameters[`${curveName}_stretch`] = value
            }
            diagram.display()
            $(`#${valueID}`).val($(`#${inputID}`).val())

        })


        $(`#${valueID}`).on("input", () => {
            const value = $(`#${valueID}`).val()
            
            if (input == "angle") {
                diagram.parameters[`${curveName}_stretch`] = degreesToSlope(parseFloat(value)) 
            }
            if (input == "shift") {
                diagram.parameters[`${curveName}_shift`] = value
            }
            if (input == "stretch") {
                diagram.parameters[`${curveName}_stretch`] = value
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

    
        const listElement = $('<li>', {
            "text": `${textA} and ${textB}`,
            "data-curveid_a": dataCurveID_A,
            "data-curveindex_a": dataCurveIndex_A,
            "data-curveid_b": dataCurveID_B,
            "data-curveindex_b": dataCurveIndex_B

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
        
        const listElement = $('<li>', {
            "data-curveid": selectedCurve,
            "data-curveindex": largestCurveIndex,
            "class": "strikethroughHover",
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
    
    $("#pairCurveList").on("click", "li", function () {
        preventDefault()
        $(this).addClass("selected")
        $(this).siblings().removeClass("selected")
    });

})