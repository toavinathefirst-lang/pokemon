import { Sprite } from "./sprite";
import gsap from 'gsap'

export class Monster extends Sprite {
    /**
     * @param {Object} options
     * @param {CanvasRenderingContext2D} options.context
     * @param {{x:number,y:number}} options.position
     * @param {HTMLImageElement} options.image
     * @param {{max:number,hold:number}} options.frames
     * @param {boolean} options.animate
     * @param {number} [options.scale=1]
     * @param {number} [options.opacity=1]
     * @param {string} options.name
     * @param {boolean} [options.isEnemy=false]
     * @param {(health:number)=>void} [options.onHealthChange]
     */
    constructor({
        context,
        position,
        image,
        frames,
        animate,
        scale,
        opacity,
        name,
        isEnemy = false,
        onHealthChange
    }) {
        super({ context, position, image, frames, animate, scale, opacity })
        /** @type {number} */
        this.health = 100
        /** @type {string} */
        this.name = name
        /** @type {boolean} */
        this.isEnemy = isEnemy
        /** @type {(health:number)=>void|undefined} */
        this.onHealthChange = onHealthChange
        /** @type {boolean} */
        this.isAttacking = false
    }

    /**
     * Retire des points de vie et notifie le callback d'affichage.
     * @param {number} amount
     */
    takeDamage(amount) {
        this.health -= amount
        if (this.onHealthChange) {
            this.onHealthChange(this.health)
        }
    }

    /**
     * Déclenche une attaque vers un autre monstre, ignorée si une attaque est déjà en cours.
     * @param {Object} options
     * @param {{name:string, damage:number, type:string}} options.attack
     * @param {Monster} options.recipient
     */
    attack({ attack, recipient }) {
        if (this.isAttacking) return

        if (attack.name === "tackle") {
            this.tackleAnimation({ attack, recipient })
        }
    }

    /**
     * Anime une charge physique vers la cible, puis lui inflige des dégâts.
     * @param {Object} options
     * @param {{name:string, damage:number, type:string}} options.attack
     * @param {Monster} options.recipient
     */
    tackleAnimation({ attack, recipient }) {
        this.isAttacking = true

        const originalX = this.position.x
        const goingRight = recipient.position.x > this.position.x
        const lungeDistance = 60
        const recoilDistance = 20

        const tl = gsap.timeline({
            onComplete: () => {
                this.isAttacking = false
            }
        })

        tl.to(this.position, {
            x: goingRight ? originalX - recoilDistance : originalX + recoilDistance,
            duration: 0.15
        }).to(this.position, {
            x: goingRight ? originalX + lungeDistance : originalX - lungeDistance,
            duration: 0.1,
            onComplete: () => {
                gsap.to(recipient.position, {
                    x: recipient.position.x + 10,
                    yoyo: true,
                    repeat: 3,
                    duration: .08,
                })
                gsap.to(recipient, {
                    opacity: 0,
                    repeat: 3,
                    yoyo: true,
                    duration: .08
                })
                recipient.takeDamage(attack.damage)
            }
        }).to(this.position, {
            x: originalX,
            duration: 0.2
        })
    }
}