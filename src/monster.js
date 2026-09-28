import { Sprite } from "./sprite";
import gsap from 'gsap'
 const dialogBox =  document.querySelector('#dialogueBox');
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
        /** @type {Sprite[]} */
        this.activeProjectiles = []
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
     * @param {{name:string, damage:number, type:string, image?:HTMLImageElement, frames?:{max:number,hold:number}}} options.attack
     * @param {Monster} options.recipient
     */
    attack({ attack, recipient }) {
        if (this.isAttacking) return

      
    //    dialogBox.innerHTML=`${this.name} used ${attack.name}`
    //    dialogBox.style.display = "block"
    //    const attackBox=document.querySelector("#attacksBox")
    //    attackBox.style.display="none"

    //    const finishAttack = () => {
            
    //         setTimeout(() => {
    //             dialogBox.style.display = "none"
    //             this.isAttacking = false
    //             attackBox.style.display="grid"
    //         }, 1000)
    //     }
        if (attack.name === "tackle") {
            this.tackleAnimation({ attack, recipient /*,onComplete: finishAttack*/})
        }else if(attack.name === "fireball"){
            this.fireBallLaunch({attack,recipient/*,onComplete: finishAttack*/})
        }
        
    }

    /**
     * @param {Monster} recipient
     */
    actuallyHit(recipient) {
        const knockbackX = recipient.isEnemy ? 10 : -10

        gsap.to(recipient.position, {
            x: recipient.position.x + knockbackX,
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
    }

    /**
     * Anime une charge physique vers la cible, puis lui inflige des dégâts.
     * @param {Object} options
     * @param {{name:string, damage:number, type:string}} options.attack
     * @param {Monster} options.recipient
     * @param {()=>void} [options.onComplete]
     */
    tackleAnimation({ attack, recipient ,/*onComplete*/}) {
        this.isAttacking = true

        const originalX = this.position.x
        const goingRight = !this.isEnemy
        const lungeDistance = 60
        const recoilDistance = 20

        const tl = gsap.timeline({
            onComplete: () => {
                this.isAttacking = false
                //if (onComplete) onComplete()
            }
        })

        tl.to(this.position, {
            x: goingRight ? originalX - recoilDistance : originalX + recoilDistance,
            duration: 0.15
        }).to(this.position, {
            x: goingRight ? originalX + lungeDistance : originalX - lungeDistance,
            duration: 0.1,
            onComplete: () => {
                this.actuallyHit(recipient)
                recipient.takeDamage(attack.damage)
            }
        }).to(this.position, {
            x: originalX,
            duration: 0.2
        })
    }
    /**
     * @param {Object} options
     * @param {{name:string, damage:number, type:string, image:HTMLImageElement, frames?:{max:number,hold:number}}} options.attack
     * @param {Monster} options.recipient
     * @param {()=>void} [options.onComplete]
     */
    fireBallLaunch({attack,recipient,onComplete}){
        this.isAttacking = true
        const projectile = new Sprite({
            context: this.context,
            position: { x: this.position.x, y: this.position.y },
            image: attack.image,
            frames: attack.frames || { max: 4, hold: 8 },
            animate: !!attack.frames,
            rotation: (this.isEnemy)?1:-2.2
        })

        this.activeProjectiles.push(projectile)
        gsap.to(projectile.position,{
            x:recipient.position.x,
            y:recipient.position.y,
            duration: 0.5,
            onComplete: () => {
                this.actuallyHit(recipient)
                recipient.takeDamage(attack.damage)
                this.activeProjectiles = this.activeProjectiles.filter(p => p !== projectile)
                this.isAttacking = false

               // if (onComplete) onComplete()
            }
        })
        
    }
}