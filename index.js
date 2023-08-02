import {curveIntersections} from './bezier.js'

//Fix:
//Make checkbox work
//Make supply slider input box work


let default_parameters = {
    "demand_curve": [[0 ,0], [1 ,1]],
    "supply_curve": [[0, 1], [1, 0]],
    "laffer_curve": [[0, 1], [0.5, 0.2], [1, 1]],
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
    }
    
    transform(points, dilationFactor, shiftFactor, curveName) {
        let newPoints = []; 
        for (let point of points) {
            let x = point[0] // [0, 1]
            let y = point[1] // [0, 1]
            let newY = 1-y // [1, 0]
            newY *= dilationFactor // [dilationFactor, 0]
            newY = 1 - newY

            newY -= shiftFactor/100
            
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

    display()  {


        const curves = this.parameters.curves 

        let notDrawnCurves = this.parameters.curves.slice()

        this.ctx.fillStyle = "rgb(228,246,248)"
        this.ctx.fillRect(0, 0, this.width, this.height)

        let allCurves = []
        let intersections = []

        for (const curve of curves) {

            let curvePoints = this.generateBezierPoints(default_parameters[curve], this.parameters[`${curve}_stretch`], this.parameters[`${curve}_shift`])
            allCurves.push(curvePoints)
            
            this.ctx.beginPath()
            this.ctx.moveTo(curvePoints[0], curvePoints[1])
            this.ctx.bezierCurveTo(curvePoints[2], curvePoints[3], curvePoints[4], curvePoints[5], curvePoints[6], curvePoints[7])
            this.ctx.strokeStyle = "blue"
            this.ctx.lineWidth = 2
            this.ctx.closePath()
            this.ctx.stroke()
        }


        for (let i = allCurves.length-1; i >= 0; i--) {
            for (let j = 0; j < allCurves.length-1; j++) {
                // console.log(i, j)
                if (!this.sameLine(allCurves[i], allCurves[j])) {
                    let foundIntersections = curveIntersections(allCurves[i], allCurves[j], 0.0, 1.0, 0.0, 1.0,
                        1.0, false, 0, 25, 0.5)
                    for (let foundIntersection of foundIntersections) {
                        intersections.push(foundIntersection[1])
                        intersections.push(foundIntersection[3])
                    }
                }
                
                
                
            }
            allCurves.pop()
            
        }
        // console.log(intersections)

        for (let intersection of intersections) {
            this.ctx.beginPath();
            this.ctx.arc(intersection[0], intersection[1], 5, 0, 2 * Math.PI);
            this.ctx.fillStyle = 'black';
            this.ctx.fill();
            this.ctx.lineWidth = 3;
            this.ctx.strokeStyle = 'black';
            this.ctx.stroke();

            // Draw dotted line from intersection to x-axis
            this.ctx.setLineDash([5, 5]); // Set line dash pattern for dotted line
            this.ctx.beginPath();
            this.ctx.moveTo(intersection[0], intersection[1]);
            this.ctx.lineTo(intersection[0], this.height); // Draw the dotted line to the x-axis
            this.ctx.strokeStyle = "black";
            this.ctx.stroke();

            // Draw dotted line from intersection to y-axis
            this.ctx.beginPath();
            this.ctx.moveTo(intersection[0], intersection[1]);
            this.ctx.lineTo(0, intersection[1]); // Draw the dotted line to the y-axis
            this.ctx.strokeStyle = "black";
            this.ctx.stroke();

            // Reset line dash pattern to solid
            this.ctx.setLineDash([]);

            //Shade CS area
            this.ctx.fillStyle = "rgb(0, 228, 0, 0.2)"
            this.ctx.beginPath()
            this.ctx.moveTo(0, intersection[1]) //Start point (0, Pm)
            this.ctx.lineTo(intersection[0], intersection[1]) //Equilibrium
            this.ctx.lineTo(0, this.height) //End point (0, 0) => calculate y coords with y-int later
            this.ctx.closePath()
            this.ctx.fill()

            //Shade TR area
            this.ctx.fillStyle = "rgb(228, 0, 0, 0.1)"
            this.ctx.fillRect(0, intersection[1], intersection[0], this.height-intersection[1])
            
            
        }

        
        
    }
}

