import {Diagram} from './index.js'
import { createElements } from './interactive.js'

let parameters = {
    // "curves": ["cost_curve", "price_floor", "demand_curve", "supply_curve", "AD_curve", "AS_curve"]
    "curves": ["demand_curve", "supply_curve", "laffer_curve"],
    "demand_curve_stretch": 1,
    "supply_curve_stretch": 1,
    "demand_curve_shift": 0,
    "supply_curve_shift": 0,
    "laffer_curve_stretch": 1,
    "laffer_curve_shift": 0
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



$(document).ready(() => {

    for (const curve of parameters["curves"]) {
        createElements(curve, diagram1)
    }

    

    
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