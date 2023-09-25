import {curveIntersections, evaluate} from './bezier.js'
import {findObjectWithValueInArrayOfObjects, CURVE_DATA} from './interactive.js'

//To Do:
//Make checkbox work
//Make customizable points
//Add area with selected pairs
//Add more customization option (bg color, line color, etc.)


let default_parameters = {
    "demand_curve": [[0 ,0], [1 ,1]],
    "supply_curve": [[0, 1], [1, 0]],
    "laffer_curve": [[0, 1], [0.5, 0.2], [1, 1]],
    "vertical_line": [[0.5, 0], [0.5, 1]],
    "horizontal_line": [[0, 0.5], [1, 0.5]]
}



export class Curve {  // diagram.curves = [Curve, Curve, ...]

    constructor(curveType, x_stretch, y_stretch, x_shift, y_shift, displayName, index) { // CurveType, float, float 
        this.curveType = curveType
        this.x_stretch = x_stretch
        this.y_stretch = y_stretch 
        this.x_shift = x_shift
        this.y_shift = y_shift
        this.displayName = displayName
        this.index = index

    }

    display() {
        
    }
}

export class Diagram {

    constructor(canvas_obj, parameters, xlabel, ylabel) {
      this.canvas_obj = canvas_obj 
      this.ctx = canvas_obj.getContext("2d")
      this.width = canvas_obj.width; 
      this.height = canvas_obj.height; 
      this.parameters = parameters 
      this.xlabel = xlabel
      this.ylabel = ylabel

      this.scaleFactor = 0.9
    }


    transform(points, dilationFactor, shiftFactor, curveName) {
        let newPoints = []; 
        for (let point of points) {
            let x = point[0] // [0, 1]
            let y = point[1] // [0, 1]
            let newY = 1-y // [1, 0]
            newY *= dilationFactor // [dilationFactor, 0]
            newY = 1 - newY

            newY -= shiftFactor/100 //Make it shift the x somehow
            
            newPoints.push([x, newY]) 
        }
        return newPoints;

    }

    generateBezierPoints(undilatedPoints, dilationFactor, shiftFactor) {
        let points = this.transform(undilatedPoints, dilationFactor, shiftFactor)

        let newPoints = [];
        let until4 = 4 - points.length;
        if (until4 == 1) {
            newPoints.push(points[0][0] * this.width );
            newPoints.push(points[0][1] * this.height );
            newPoints.push(points[1][0] * this.width );
            newPoints.push(points[1][1] * this.height);
            newPoints.push(points[1][0] * this.width);
            newPoints.push(points[1][1] * this.height);
            newPoints.push(points[2][0] * this.width);
            newPoints.push(points[2][1] * this.height);
        } else {
            for (let i = 0; i < until4; i++) {
                newPoints.push(points[0][0] * this.width);
                newPoints.push(points[0][1] * this.height);
            }
            for (let point of points) {
                newPoints.push(point[0] * this.width);
                newPoints.push(point[1] * this.height);
            }
        }
        return newPoints;
    }
    
    sameLine(graphA, graphB) {

        const startPoint = [graphA[0], graphA[1]]
        const endPoint = [graphA[graphA.length-2], graphA[graphA.length-1]]
        const slope = (endPoint[1] - startPoint[1])/(endPoint[0]-startPoint[0])
        const intercept = startPoint[1]-slope*startPoint[0]
        
        for (let i = 0; i < graphB.length; i+=2) {
            const pointB = [graphB[i], graphB[i+1]]
            const x = pointB[0]
            const realY = pointB[1]
            const hypotheticalY = slope*x + intercept

            const diff = Math.abs(realY - hypotheticalY)
            // console.log(endPoint[1]-startPoint[1])

            if (diff > 0.01) {
                return false                 
            }
        }
        return true 
    }

    distSqr(p1, p2) {
        return (p1[0] - p2[0]) ** 2 + (p2[1] - p1[1]) ** 2 
    }

    removeSimilarPoints(points) {
        const newPoints = []
        for (const point of points) {
            let diffPoint = true
            for (const newPoint of newPoints) {
                const distBetween = this.distSqr(point, newPoint) 
                if (distBetween < 0.1) { // diff point
                    diffPoint = false
                    break  
                }
            }
            if (diffPoint) {
                newPoints.push(point)
            }

        }
        return newPoints
    }

    // abcdₑfgₕᵢⱼₖₗₘₙₒₚqᵣₛₜᵤᵥwₓyz

    numberToSub(numb) {
        let subscriptString = ""
        const subscripts = {"0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇" ,"8":"₈" ,"9":"₉"}
        for (const chara of numb) {
            if (!isNaN(chara)) {
                subscriptString += subscripts[chara]
            } else {
                subscriptString += chara 
            }
        }
        return subscriptString
    }

    generateIntersections() {
        const curves = this.parameters.curves 
        let allCurves = []
        let intersections = []
        for (const curve of curves) {
            

            let curvePoints = this.generateBezierPoints(default_parameters[curve["type"]], curve["stretch"], curve["shift"])
            allCurves.push(curvePoints)
        }
    }

    displayLatex(equation, x, y) {
        // const equation = "\\mathrm{x} = \\sin \\left( \\frac{\\pi}{2} \\right)";
        const svg = MathJax.tex2svg(equation).firstElementChild
        const img = document.createElement('img')

        img.onload = (e) => {
            
            const tempWidth = e.target.naturalWidth;
            const tempHeight = e.target.naturalHeight;

            this.ctx.setTransform(this.scaleFactor, 0, 0, this.scaleFactor, this.width*(1-this.scaleFactor), 0)
            this.ctx.drawImage(e.target, x, y, tempWidth, tempHeight)
        }
        img.src = 'data:image/svg+xml;base64,' + btoa('<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n' + svg.outerHTML);

    }

    drawPoint(label, x, y) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, 5, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'black';
        this.ctx.fill();
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = 'black';
        this.ctx.stroke();

        this.ctx.font = "bold 16px Roboto"
        this.ctx.lineWidth = 1.5
        this.ctx.fillStyle = "black"
        this.ctx.textAlign = "left"

        this.ctx.fillText(this.numberToSub(label), x+10, y+10)
    }

    display()  {

        const curves = this.parameters.curves 

        let notDrawnCurves = this.parameters.curves.slice()

        this.ctx.resetTransform()
        this.ctx.fillStyle = "rgb(228,246,248)" //"rgb(228,246,248)"
        this.ctx.fillRect(0, 0, this.width, this.height)

        this.ctx.setTransform(this.scaleFactor, 0, 0, this.scaleFactor, this.width*(1-this.scaleFactor), 0)


        let allCurves = []
        let intersections = []

        for (const curve of curves) {
            

            let curvePoints = this.generateBezierPoints(default_parameters[curve["type"]], curve["stretch"], curve["shift"])

            allCurves.push({"points": curvePoints, "curveData": curve})
            
            this.ctx.beginPath()
            this.ctx.moveTo(curvePoints[0], curvePoints[1])
            this.ctx.bezierCurveTo(curvePoints[2], curvePoints[3], curvePoints[4], curvePoints[5], curvePoints[6], curvePoints[7])
            this.ctx.strokeStyle = "black"
            this.ctx.lineWidth = 3
            this.ctx.closePath()
            this.ctx.stroke()
        }

        

        const newAllCurves = structuredClone(allCurves)
        const labeledIntersections =  {}

        for (let i = newAllCurves.length-1; i >= 0; i--) {
            for (let j = 0; j < newAllCurves.length-1; j++) {
                // console.log(i, j)
                if (!this.sameLine(newAllCurves[i]["points"], newAllCurves[j]["points"])) {

                    let foundIntersections = curveIntersections(newAllCurves[i]["points"], newAllCurves[j]["points"], 0.0, 1.0, 0.0, 1.0,
                        1.0, false, 0, 25, 0.5)
                    for (let foundIntersection of foundIntersections) {
                        intersections.push(foundIntersection[1])
                        intersections.push(foundIntersection[3])

                        const curveData1 = newAllCurves[i]["curveData"]
                        const curveData2 = newAllCurves[j]["curveData"]
                        
                        const label1 = CURVE_DATA[curveData1["type"]]["shorthand"] + (curveData1["index"]+1)
                        const label2 = CURVE_DATA[curveData2["type"]]["shorthand"] + (curveData2["index"]+1)
                        const labelToUse = label1 + " " + label2

                        labeledIntersections[labelToUse] = this.removeSimilarPoints([foundIntersection[1], foundIntersection[3]])
                    
                    }
                }
                
                
                
            }
            newAllCurves.pop()
            
        }
        intersections = this.removeSimilarPoints(intersections)

        const allYIntercepts = []
        for (const curve of allCurves) {
            const firstPointY = curve[1]
            allYIntercepts.push(firstPointY)
        }

        let maxY = 0 
        for (const firstPointY of allYIntercepts) {
            if (firstPointY > maxY) {
                maxY = firstPointY
            }
        }

        let minY = Infinity 
        for (const firstPointY of allYIntercepts) {
            if (firstPointY < minY) {
                minY = firstPointY
            }
        }
        // console.log(intersections)

        // for (let intersection of intersections) {
        //     this.ctx.beginPath();
        //     this.ctx.arc(intersection[0], intersection[1], 5, 0, 2 * Math.PI);
        //     this.ctx.fillStyle = 'black';
        //     this.ctx.fill();
        //     this.ctx.lineWidth = 3;
        //     this.ctx.strokeStyle = 'black';
        //     this.ctx.stroke();

        //     // Draw dotted line from intersection to x-axis
        //     this.ctx.setLineDash([5, 5]); // Set line dash pattern for dotted line
        //     this.ctx.beginPath();
        //     this.ctx.moveTo(intersection[0], intersection[1]);
        //     this.ctx.lineTo(intersection[0], this.height); // Draw the dotted line to the x-axis
        //     this.ctx.strokeStyle = "black";
        //     this.ctx.stroke();



        //     // Draw dotted line from intersection to y-axis
        //     this.ctx.beginPath();
        //     this.ctx.moveTo(intersection[0], intersection[1]);
        //     this.ctx.lineTo(0, intersection[1]); // Draw the dotted line to the y-axis
        //     this.ctx.strokeStyle = "black";
        //     this.ctx.stroke();

        //     // Reset line dash pattern to solid
        //     this.ctx.setLineDash([]);

        //     //Shade PS area
        //     this.ctx.fillStyle = "rgb(0, 228, 0, 0.2)"
        //     this.ctx.beginPath()
        //     this.ctx.moveTo(0, intersection[1]) //Start point (0, Pm)
        //     this.ctx.lineTo(intersection[0], intersection[1]) //Equilibrium
        //     this.ctx.lineTo(0, maxY) //End point (0, 0) => calculate y coords with y-int later
        //     this.ctx.closePath()
        //     this.ctx.fill()

        //     //Shade CS area
        //     this.ctx.fillStyle = "rgb(0, 0, 228, 0.2)"
        //     this.ctx.beginPath()
        //     this.ctx.moveTo(0, intersection[1]) //Start point (0, Pm)
        //     this.ctx.lineTo(intersection[0], intersection[1]) //Equilibrium
        //     this.ctx.lineTo(0, minY) //End point (0, 0) => calculate y coords with y-int later
        //     this.ctx.closePath()
        //     this.ctx.fill()

        //     //Shade TR area
        //     // this.ctx.fillStyle = "rgb(228, 0, 0, 0.1)"
        //     // this.ctx.fillRect(0, intersection[1], intersection[0], this.height-intersection[1])
            
            
        // }

        for (const point of this.parameters.points) {
            const active = point["active"]
            const pointLabel = point["label"]
            const pointData = point[active]
            if (active == "coordinates") {
                const percentX = findObjectWithValueInArrayOfObjects(point["coordinates"], "class", "coordinateX")[0]["value"]
                const percentY = findObjectWithValueInArrayOfObjects(point["coordinates"], "class", "coordinateY")[0]["value"]

                const x = percentX / 100. * this.width
                const y = (100 - percentY) / 100. * this.height

                this.drawPoint(pointLabel, x, y)
                

            }

            if (active == "alongcurve"){
                const tValue = findObjectWithValueInArrayOfObjects(point["alongcurve"], "class", "tValue")[0]["value"]
                const selectedCurve = findObjectWithValueInArrayOfObjects(point["alongcurve"], "class", "selectedCurve")[0]["value"]

                let foundCurve

                for (const curve of curves) {
                    const shorthand = CURVE_DATA[curve["type"]]["shorthand"] + (curve["index"]+1)
                    if (shorthand === selectedCurve)
                        foundCurve = curve
                }
                
                if (foundCurve) {
                    let curvePoints = this.generateBezierPoints(default_parameters[foundCurve["type"]], foundCurve["stretch"], foundCurve["shift"])
                    const [x, y] = evaluate(curvePoints, tValue/100, 0)
                    // console.log("EVALUATED AT t=0.5", ev)
                    this.drawPoint(pointLabel, x, y)

                }
                }
            
            if (active == "intersection"){

                const curveA = findObjectWithValueInArrayOfObjects(point["intersection"], "class", "intersectionSelectA")[0]["value"]
                const curveB = findObjectWithValueInArrayOfObjects(point["intersection"], "class", "intersectionSelectB")[0]["value"]

                const curveLabel = curveA + " " + curveB
                const curveLabel2 = curveB + " " + curveA

                let intersectionPoint = labeledIntersections[curveLabel]
                
                if (!intersectionPoint)
                    intersectionPoint = labeledIntersections[curveLabel2]

                if (intersectionPoint) {
                    // console.log("intesrctoin POINT", intersectionPoint)
                    const [x, y] = intersectionPoint[0] // TODO: support for multiple points
                    this.drawPoint(pointLabel, x, y)
                }

                

                

                // // Draw dotted line from intersection to x-axis
                // this.ctx.setLineDash([5, 5]); // Set line dash pattern for dotted line
                // this.ctx.beginPath();
                // this.ctx.moveTo(intersection[0], intersection[1]);
                // this.ctx.lineTo(intersection[0], this.height); // Draw the dotted line to the x-axis
                // this.ctx.strokeStyle = "black";
                // this.ctx.stroke();



                // // Draw dotted line from intersection to y-axis
                // this.ctx.beginPath();
                // this.ctx.moveTo(intersection[0], intersection[1]);
                // this.ctx.lineTo(0, intersection[1]); // Draw the dotted line to the y-axis
                // this.ctx.strokeStyle = "black";
                // this.ctx.stroke();
            }

        }

        this.ctx.resetTransform()

        const axisStartX = this.width*(1-this.scaleFactor)
        const axisStartY = this.height*(1-this.scaleFactor)
        

        this.ctx.fillStyle = "rgb(255,255,255)" 
        this.ctx.fillRect(0, 0, axisStartX, this.height)
        this.ctx.fillRect(0, this.height - axisStartY, this.width, this.height)


        // Draw x-axis
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.moveTo(axisStartX, 0);
        this.ctx.lineTo(axisStartX, this.height - this.height*(1-this.scaleFactor)/1);
        this.ctx.stroke();
                
        // Draw y-axis
        this.ctx.beginPath();
        this.ctx.moveTo(this.width*(1-this.scaleFactor)/1, this.height - axisStartY);
        this.ctx.lineTo(this.width, this.height - axisStartY);
        this.ctx.stroke();

        // axis names

        this.ctx.font = "bold 24px Roboto"
        this.ctx.lineWidth = 1.5
        this.ctx.fillStyle = "black"
        this.ctx.textAlign = "right";
        this.ctx.translate(35, 5)

        if (this.parameters["rotated"]){
            this.ctx.rotate(-Math.PI/2)
            this.ctx.fillText(this.parameters[`ylabel`], 0, 0)
        } else {
            this.ctx.fillText(this.parameters[`ylabel`], -5, 30)
        }
        this.ctx.resetTransform()
        this.ctx.fillText(this.parameters[`xlabel`], this.width-axisStartX+40, this.height-axisStartY+30)
        
        //Try to get points along the curves

       

    }
}

