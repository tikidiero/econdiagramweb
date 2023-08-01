import {Diagram} from './index.js'

let parameters = {
    // "curves": ["cost_curve", "price_floor", "demand_curve", "supply_curve", "AD_curve", "AS_curve"]
    "curves": ["demand_curve", "supply_curve"],
    "demand_slope": 1,
    "supply_slope": 1,
    "demand_shift": 0,
}

let sliderParameters = {
    "demand_curve": {"type": "linear", "default_slope": 1}, 
    

}

const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
console.log(canvas.width, canvas.height)

let diagram1 = new Diagram(canvas, parameters, "XLABEL", "YLABEL") 



if (!parameters.curves.includes("demand_curve")) {
    $("#demandSliders").addClass("hidden")
}

let sliderData = {
    "demand_curve": {
        "id": "demand_slider",
        "input_type": "degrees",
        "range": [0, 45]
    },
    "laffer_curve": {
        "id": "laffer_slider",
        "input_type": "normal",
        "range": [0, 2]
    }
}

if (parameters.curves.includes("demand_curve")) {
    //Angle Slider
    $('<div>', {
        id: 'demand_slider',
    }).appendTo('.sliders');

    $('<label>Demand Angle:</label>',  {  
        for: "slider1"
    }).appendTo("#demand_slider")

    $('<input>',  {  
        class: "slider",
        id: "slider1",
        type: "range",
        min: "0",
        max: "90",
        value: "45",
        step: "1"
    }).appendTo("#demand_slider")

    $('<input>',  {  
        class: "slider-value",
        id: "sliderValue1",
        type: "number",
        min: "0",
        max: "90",
        value: "45"
    }).appendTo("#demand_slider")

    //shift slider
    $('<div>', {
        id: 'demand_shift',
    }).appendTo('.sliders');

    $('<label>Demand Shift:</label>',  {  
        for: "DemandShift"
    }).appendTo("#demand_slider")

    $('<input>',  {  
        class: "slider",
        id: "DemandShiftSlider",
        type: "range",
        min: "-100",
        max: "100",
        value: "0",
        step: "1"
    }).appendTo("#demand_slider")

    $('<input>',  {  
        class: "demand-shift-value",
        id: "demandshiftvalue",
        type: "number",
        min: "-100",
        max: "100",
        value: "0"
    }).appendTo("#demand_slider")
}

if (parameters.curves.includes("supply_curve")) {
    $('<div>', {
        id: 'supply_slider',
    }).appendTo('.sliders');

    $('<label>Supply Angle:</label>',  {  
        for: "slider2"
    }).appendTo("#supply_slider")

    $('<input>',  {  
        class: "slider",
        id: "slider2",
        type: "range",
        min: "0",
        max: "90",
        value: "45",
        step: "1"
    }).appendTo("#supply_slider")

    $('<input>',  {  
        class: "slider-value",
        id: "sliderValue2",
        type: "number",
        min: "0",
        max: "90",
        value: "45"
    }).appendTo("#supply_slider")
}

let testangle = 0


$(document).ready(() => {



// Clean up code
    demandshiftvalue.addEventListener('input', () => {
        DemandShiftSlider.value = demandshiftvalue.value
        diagram1.parameters.demand_shift = demandshiftvalue.value
        diagram1.display()
    })

    DemandShiftSlider.addEventListener('input', () => {
        demandshiftvalue.value = DemandShiftSlider.value
        diagram1.parameters.demand_shift = demandshiftvalue.value
        diagram1.display()
    })

    sliderValue1.addEventListener('input', () => {
        slider1.value = sliderValue1.value
        diagram1.parameters.demand_slope = Math.tan(parseFloat(sliderValue1.value)*Math.PI/180) //parseFloat(sliderValue1.value)
        testangle = Math.tan(parseFloat(sliderValue1.value)*Math.PI/180)
        diagram1.display()
    })

    slider1.addEventListener('input', () => {
        sliderValue1.value = slider1.value
        diagram1.parameters.demand_slope = Math.tan(parseFloat(sliderValue1.value)*Math.PI/180) //parseFloat(sliderValue1.value)
        testangle = Math.tan(parseFloat(sliderValue1.value)*Math.PI/180)
        diagram1.display()
    })

    // Clean up code
    sliderValue2.addEventListener('input', () => {
        slider2.value = sliderValue2.value
        diagram1.parameters.supply_slope = Math.tan(parseFloat(sliderValue1.value)*Math.PI/180) //parseFloat(sliderValue1.value)
        testangle = Math.tan(parseFloat(sliderValue2.value)*Math.PI/180)
        diagram1.display()
    })

    slider2.addEventListener('input', () => {
        sliderValue2.value = slider2.value
        diagram1.parameters.supply_slope = Math.tan(parseFloat(sliderValue2.value)*Math.PI/180) //parseFloat(sliderValue1.value)
        testangle = Math.tan(parseFloat(sliderValue2.value)*Math.PI/180)
        diagram1.display()
    })


    
    $("#showTR").change((e) => {
        const checkbox = $("showTR").get() 
        // const checked = document.getElementById('showTR').checked
        console.log(checkbox)
        // if (checked) {
        //     console.log("hhello it has been checkewd")
        // } else {
        //     console.log("goodbye it has been unchecked")
        // }
        // console.log($(e.target.id))
        // const checked = $(this).is(":checked")
        // if (checked) {
        //     console.log("OMG")
        // }
        // console.log("check if it works for now")
    })

    diagram1.display()

})