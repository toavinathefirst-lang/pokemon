export class Player {
    /**
     * @param {Object} options
     * 
     * @param {CanvasRenderingContext2D} options.context
     * @param {Object.<string, HTMLImageElement>} options.images  // { up, down, left, right }
     * @param {string} [options.direction='down']
     */
    constructor({ context, images, direction = 'down' }) {
        /** @type {CanvasRenderingContext2D} */
        this.context = context
        /** @type {Object.<string, HTMLImageElement>} */
        this.images = images
        /** @type {string} */
        this.direction = direction
        /** @type {HTMLImageElement} */
        this.image = this.images[this.direction]
        /** @type {{max:number, hold:number, val:number, elapsed:number}} */
        this.frames = { max: 4, hold: 8, val: 0, elapsed: 0 }
        /** @type {boolean} */
        this.moving=false
    }

    /**
     * Change la direction du joueur, son sprite, et le met en mouvement.
     * @param {'up'|'down'|'left'|'right'} direction
     * @returns {void}
     */
    setDirection(direction) {
        this.moving=true
        this.direction = direction
        this.image = this.images[direction]
    }

    /**
     * @param {HTMLCanvasElement} canvas
     * @returns {void}
     */
    draw(canvas) {
        const frameWidth = this.image.width / this.frames.max
        const sx = this.frames.val * frameWidth
        this.context.drawImage(
            this.image,
            sx, 0,
            frameWidth,
            this.image.height,
            canvas.width / 2 - frameWidth / 2,
            canvas.height / 2 - this.image.height / 2,
            frameWidth,
            this.image.height
        )
        this.moveAnimation()
       
    }
    /**
     * Retourne la boîte de collision du joueur, toujours centrée sur le canvas.
     * @param {HTMLCanvasElement} canvas
     * @returns {{position:{x:number,y:number}, width:number, height:number}}
     */
    getBox(canvas) {
        const fullWidth = this.image.width / 4
        const fullHeight = this.image.height

        const padding = { x: 10, y: 4 } // à ajuster selon ton sprite

        const width = fullWidth - padding.x * 2
        const height = fullHeight - padding.y * 2

        return {
            position: {
                x: canvas.width / 2 - width / 2,
                y: canvas.height / 2 - height / 2
            },
            width,
            height
        }
    }
    /**
     * Fait avancer l'animation de marche, ou remet la première frame si le joueur est à l'arrêt.
     * @returns {void}
     */
    moveAnimation(){
        if(!this.moving){
            this.frames.val=0
            return
        }
        if(this.frames.max >1){
            this.frames.elapsed++
        }
        if(this.frames.elapsed%10==0){
            if(this.frames.val < this.frames.max-1){
            this.frames.val++
        }else this.frames.val=0
        }
        
    }
    
}