export class Curve {
    
    // STORE: CurveShell, name, index, shorthand, x_stretch, y_stretch, x_shift, y_shift

  
    constructor(curveShell, name, index, shorthand, x_stretch, y_stretch, x_shift, y_shift) {
      this.default_points = default_points
      this.curveShell = curveShell
      this.name = name
      this.index = index
      this.shorthand = shorthand
      this.x_stretch = x_stretch
      this.y_stretch = y_stretch
      this.x_shift = x_shift
      this.y_shift = y_shift
    }
  }