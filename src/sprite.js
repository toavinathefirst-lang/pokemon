export class Sprite{
    /**
     *
     * @param {Object} options
     * @param {CanvasRenderingContext2D} options.context
     * @param {{x:number,y:number}} options.position
     * @param {{x:number,y:number}} options.velocity
     * @param {HTMLImageElement} options.image
     * @param {{max:number,hold:number}} [options.frames={max:1,hold:10}]
     * @param {boolean} [options.animate=false]
     * @param {number} [options.scale=1]
     */
    constructor({
        context,
        position,
        velocity ={x:0,y:0},
        image,
        frames = { max: 1, hold: 10 },
        animate = false,
        // sprites,
        // animate = false,
        // rotation = 0,
        scale = 1
    }){
        this.context=context
        this.position=position;
        this.velocity=velocity;
        this.image=image
        this.frames = { ...frames, val: 0, elapsed: 0 }
        this.animate=animate

        const setDimensions = () => {
            this.width=(this.image.width / this.frames.max)*scale
            this.height=this.image.height * scale
        }

        if (this.image.complete && this.image.naturalWidth !== 0) {
            setDimensions()
        } else {
            this.image.addEventListener('load', setDimensions)
        }

        if (this.image.complete && this.image.naturalWidth !== 0) {
            setDimensions()
        } else {
            this.image.addEventListener('load', setDimensions)
        }

        // this.animate = animate
        // this.sprites = sprites
        // this.opacity = 1

        // this.rotation = rotation
        // this.scale = scale
    }
    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     */
    draw(canvas){
        const frameWidth = this.image.width / this.frames.max
        const sx = this.frames.val * frameWidth
        this.context.drawImage(
            this.image,
            sx, 0,
            frameWidth,
            this.image.height,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )

        if (!this.animate) return
        

        if (this.frames.max > 1) {
            this.frames.elapsed++
        }
        if (this.frames.elapsed % this.frames.hold === 0) {
            if (this.frames.val < this.frames.max - 1) this.frames.val++
            else this.frames.val = 0
        }
       
    }
}