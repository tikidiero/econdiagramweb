import {curveIntersections} from './bezier.js'

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
    
    transform(points, dilationFactor, curveName) {
        let newPoints = []; 
        for (let point of points) {
            let x = point[0] // [0, 1]
            let y = point[1] // [0, 1]
            let newY = 1-y // [1, 0]
            newY *= dilationFactor // [dilationFactor, 0]
            newY = 1 - newY

            newPoints.push([x, newY])
            
        }
        return newPoints;

    }

    generateBezierPoints(undilatedPoints, dilationFactor) {
        let points = this.transform(undilatedPoints, dilationFactor)

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
        const endPoint = [graphA[graphA.length-1], graphA[graphA.length-2]]
        const slope = (endPoint[1] - startPoint[1])/(endPoint[0]-startPoint[0])
        const intercept = startPoint[1]-slope*startPoint[0]
        
        for (let i = 0; i < graphB.length; i+=2) {
            const pointB = [graphB[i], graphB[i+1]]
            const x = pointB[0]
            const realY = pointB[1]
            const hypotheticalY = slope*x + intercept

            const diff = Math.abs(realY - hypotheticalY)
            // console.log("slope", endPoint[1], startPoint[1], intercept)

            if (diff > 0.01) {
                return false                 
            }
        }
        return true 
    }

    display()  {

        let not_drawn_curves = this.parameters.curves.slice()

        this.ctx.fillStyle = "rgb(228,246,248)"
        this.ctx.fillRect(0, 0, this.width, this.height)

        let allCurves = []
        let intersections = []

        if (this.parameters.curves.includes("demand_curve")) {

            const demandindex = not_drawn_curves.indexOf("demand_curve")
            if (demandindex !== -1){
                not_drawn_curves.splice(demandindex, 1)
            }

            let demandCurve = this.generateBezierPoints(default_parameters.demand_curve, this.parameters.demand_slope)
            allCurves.push(demandCurve)
            
            this.ctx.beginPath()
            this.ctx.moveTo(demandCurve[0], demandCurve[1])
            this.ctx.bezierCurveTo(demandCurve[2], demandCurve[3], demandCurve[4], demandCurve[5], demandCurve[6], demandCurve[7])
            this.ctx.strokeStyle = "blue"
            this.ctx.lineWidth = 2
            this.ctx.closePath()
            this.ctx.stroke()

        if (this.parameters.curves.includes("supply_curve")) {

            const supplyindex = not_drawn_curves.indexOf("supply_curve")
            if (supplyindex !== -1){
                not_drawn_curves.splice(supplyindex, 1)
            }

            let supplyCurve = this.generateBezierPoints(default_parameters.supply_curve, this.parameters.supply_slope)
            allCurves.push(supplyCurve)
    
            this.ctx.beginPath()
            this.ctx.moveTo(supplyCurve[0], supplyCurve[1])
            this.ctx.bezierCurveTo(supplyCurve[2], supplyCurve[3], supplyCurve[4], supplyCurve[5], supplyCurve[6], supplyCurve[7])
            this.ctx.strokeStyle = "red"; // You can set the color for the supply curve
            this.ctx.lineWidth = 2
            this.ctx.closePath()
            this.ctx.stroke()
        
        if (not_drawn_curves.length > 0){
            for (let curveName of not_drawn_curves) {

                let curve = this.generateBezierPoints(default_parameters[curveName], 1)
                allCurves.push(curve)
    
                this.ctx.beginPath()
                this.ctx.moveTo(curve[0], curve[1])
                this.ctx.bezierCurveTo(curve[2], curve[3], curve[4], curve[5], curve[6], curve[7])
                this.ctx.strokeStyle = "blue"
                this.ctx.lineWidth = 2
                this.ctx.closePath()
                this.ctx.stroke()
            }
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

            //Shade TR area
            this.ctx.fillStyle = "rgb(228, 0, 0, 0.1)"
            this.ctx.fillRect(0, intersection[1], intersection[0], this.height-intersection[1])
            
            let showTRCheckbox = document.getElementById('showTR');

            showTRCheckbox.addEventListener('change', () => {

            let showTR = showTRCheckbox.checked;
            
            if (showTR) {
            console.log('Total Revenue checkbox is checked.');
            } //else {
            // console.log('Total Revenue checkbox is unchecked.');
            // }
        });
            }

        
        
    }
}
}
}