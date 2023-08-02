let sliderData = {
    "demand_curve": {
        "id": "demand_slider",
        "curve_name": "Demand",
        "inputs": ["angle", "shift"],
        "ranges": [[0, 90], [-100, 100]],
    },
    "supply_curve": {
        "id": "supply_slider",
        "curve_name": "Supply",
        "inputs": ["angle", "shift"],
        "ranges": [[0, 90], [-100, 100]],
    },
    "laffer_curve": {
        "id": "laffer_slider",
        "curve_name": "Laffer",
        "inputs": ["stretch", "shift"],
        "ranges": [[0, 5], [-100, 100]]
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




