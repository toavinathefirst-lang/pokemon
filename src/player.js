export class Player {
    /**
     * @param {Object} options
     * 
     * @param {CanvasRenderingContext2D} options.context
     * @param {Object.<string, HTMLImageElement>} options.images  // { up, down, left, right }
     * @param {string} [options.direction='down']
     */
    constructor({ context, images, direction = 'down' }) {
        this.context = context
        this.images = images
        this.direction = direction
        this.image = this.images[this.direction]
    }

    setDirection(direction) {
        this.direction = direction
        this.image = this.images[direction]
    }

    /**
     * @param {HTMLCanvasElement} canvas
     */
    draw(canvas) {
        this.context.drawImage(
            this.image,
            0, 0,
            this.image.width / 4,
            this.image.height,
            canvas.width / 2 - (this.image.width / 4) / 2,
            canvas.height / 2 - this.image.height / 2,
            this.image.width / 4,
            this.image.height
        )
    }
    /**
     * Retourne la boîte de collision du joueur, toujours centrée sur le canvas.
     * @param {HTMLCanvasElement} canvas
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
}