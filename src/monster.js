import { Sprite } from "./sprite";
import gsap from 'gsap'

//const dialogBox =  document.querySelector('#dialogueBox');
/**
 * @typedef {import('./data/types').AttackData} AttackData
 */
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
     * @param {AttackData[]} [options.attacks=[]] Attaques que ce monstre peut utiliser
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
        attacks = [],
        name,
        isEnemy = false,
        onHealthChange
    }) {
        super({ context, position, image, frames, animate, scale, opacity })
         /** @type {{x:number,y:number}} */
        this.initialPosition = { x: position.x, y: position.y }
        /** @type {number} */
        this.health = 100
        /** @type {string} */
        this.name = name
        /** @type {AttackData[]} */
        this.attacks = attacks
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
        this.health = Math.max(this.health - amount, 0)
        if (this.onHealthChange) {
            this.onHealthChange(this.health)
        }
    }
        /**
     * Remet le monstre dans son état de début de combat.
     * @returns {void}
     */
    reset() {
        this.health = 100
        this.opacity = 1
        this.position.x = this.initialPosition.x
        this.position.y = this.initialPosition.y
        this.isAttacking = false
        this.activeProjectiles = []
        if (this.onHealthChange) {
            this.onHealthChange(this.health)
        }
    }

    /**
     * Choisit une attaque au hasard parmi celles du monstre.
     * @returns {AttackData|undefined}
     */
    randomAttack() {
        return this.attacks[Math.floor(Math.random() * this.attacks.length)]
    }

    /**
     * Déclenche une attaque vers un autre monstre, ignorée si une attaque est déjà en cours.
     * L'animation jouée dépend de `attack.animation` et non du nom de l'attaque.
     * @param {Object} options
     * @param {AttackData} options.attack
     * @param {Monster} options.recipient
     * @param {()=>void} [options.onComplete] Appelée quand l'attaque est entièrement terminée
     * @returns {void}
     */
    attack({ attack, recipient,onComplete }) {
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
        if (attack.animation === "melee") {
            this.tackleAnimation({ attack, recipient ,onComplete})
        }else if(attack.animation === "projectile"){
            this.fireBallLaunch({attack,recipient,onComplete})
        }else if (onComplete) {
        
            onComplete()
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
     * Anime la défaite du monstre : il s'enfonce légèrement et disparaît.
     * Le délai laisse finir l'animation des dégâts.
     * @param {()=>void} [onComplete] Appelée quand le monstre a disparu
     * @returns {void}
     */
    faint(onComplete){
        gsap.to(this.position,{
            y:this.position.y+20,
            duration:.6,
            delay:.4

        })
        gsap.to(this,{
            opacity: 0,
            duration: .6,
            delay: .4,
            onComplete: () => {
                if (onComplete) onComplete()
            }
        })
    }

    /**
     * Anime une charge physique vers la cible, puis lui inflige des dégâts.
     * @param {Object} options
     * @param {AttackData} options.attack
     * @param {Monster} options.recipient
     * @param {()=>void} [options.onComplete]
     * @returns {void}
     */
    tackleAnimation({ attack, recipient ,onComplete}) {
        this.isAttacking = true

        const originalX = this.position.x
        const goingRight = !this.isEnemy
        const lungeDistance = 60
        const recoilDistance = 20

        const tl = gsap.timeline({
            onComplete: () => {
                this.isAttacking = false
                if (onComplete) onComplete()
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
     * Lance un projectile vers la cible, puis lui inflige des dégâts à l'impact.
     * @param {Object} options
     * @param {AttackData & {image: HTMLImageElement}} options.attack
     * @param {Monster} options.recipient
     * @param {()=>void} [options.onComplete]
     * @returns {void}
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

               if (onComplete) onComplete()
            }
        })
        
    }
    
}