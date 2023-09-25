export class CurveShell {
    
    static Demand = new CurveShell([[0 ,0], [1 ,1]]) // AD 
    static Supply = new CurveShell([[0, 1], [1, 0]])
    static Vertical = new CurveShell([[0.5, 0], [0.5, 1]]) // LRAS 
    static Horizontal = new CurveShell([[0, 0.5], [1, 0.5]])
    static Laffer = new CurveShell([[0, 1], [0.5, 0.2], [1, 1]])
    
    constructor(default_points) {
      this.default_points = default_points
    }
  }