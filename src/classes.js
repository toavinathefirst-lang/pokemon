export class Sprite{
    /**
     *
     * @param {Object} options
     * @param {CanvasRenderingContext2D} options.context
     * @param {{x:number,y:number}} options.position
     * @param {{x:number,y:number}} options.velocity
     * @param {HTMLImageElement} options.image
     * @param {{max:number,hold:number}} [options.frames={max:1,hold:10}]
     * @param {Object.<string, HTMLImageElement>} [options.sprites]
     * @param {boolean} [options.animate=false]
     * @param {number} [options.rotation=0]
     * @param {number} [options.scale=1]
     */
    constructor({
        context,
        position,
        velocity ={x:0,y:0},
        image,
        // frames = { max: 1, hold: 10 },
        // sprites,
        // animate = false,
        // rotation = 0,
        // scale = 1
    }){
        this.context=context
        this.position=position;
        this.velocity=velocity;
        this.image=image
        // this.frames = { ...frames, val: 0, elapsed: 0 }
        // this.image.onload =()=>{
        //     this.width=(this.image.width / this.frames.max)*scale
        //     this.height=this.image.height * scale
        // }
        //   this.image.src = image.src

        // this.animate = animate
        // this.sprites = sprites
        // this.opacity = 1

        // this.rotation = rotation
        // this.scale = scale
    }
    draw(){
        this.context.drawImage(this.image,this.position.x,this.position.y)
    }
}