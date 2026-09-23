export class Boundary {
    static width =48
    static height =48
    /**
     * @param {Object} options
     *@param {CanvasRenderingContext2D} options.context
     @param {{x:number,y:number}} options.position
     */
    constructor({context,position}){
        this.position = position;
        this.width= 48;
        this.height=48;
        this.context=context
    }
   draw(){
        this.context.fillStyle = "gray"
        this.context.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}