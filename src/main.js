import './style.css'
import gsap from 'gsap'

import petTownUrl from './assets/chrisCourseAssets/ChrisCoursesPokemon/Tiled/Pellet TownZoom.png'
import playerDown from './assets/chrisCourseAssets/ChrisCoursesPokemon/Images/playerDown.png'
import playerUp from "./assets/chrisCourseAssets/ChrisCoursesPokemon/Images/playerUp.png"
import playerLeft from "./assets/chrisCourseAssets/ChrisCoursesPokemon/Images/playerLeft.png"
import playerRight from "./assets/chrisCourseAssets/ChrisCoursesPokemon/Images/playerRight.png"
import foreGroundObject from "./assets/chrisCourseAssets/ChrisCoursesPokemon/Tiled/foreground object.png"
import backGroundBattleImage from "./assets/chrisCourseAssets/ChrisCoursesPokemon/Images/battleBackground.png"

import { Monster } from './monster'
import { Sprite } from './sprite';
import { Boundary } from './boundary'
import { Player } from './player'

import { collisionMap } from './data/collisions'
import { battleZoneArray } from './data/battleZone'
import { monsters } from './data/monsters'

const canvas = document.querySelector("canvas");
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const collisionArray = []
for (let i = 0; i < collisionMap.length; i += 70) {
    collisionArray.push(collisionMap.slice(i, 70 + i))
}
const battleZoneMap = []
for (let i = 0; i < battleZoneArray.length; i += 70) {
    battleZoneMap.push(battleZoneArray.slice(i, 70 + i))
}

const offset = {
    x: -735, y: -620
}

/**
 * @type {Boundary[]}
 */
const boundaries = []
collisionArray.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol == 1025) {
            boundaries.push(new Boundary({
                context: c,
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            }))
        }
    })
})

/**
 * @type {Boundary[]}
 */
const battleZone = []

battleZoneMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol == 1025) {
            battleZone.push(new Boundary({
                context: c,
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            }))
        }
    })
})

const image = new Image();
const foreGroundImage = new Image();
foreGroundImage.src = foreGroundObject
image.src = petTownUrl;

const playerImages = {
    up: new Image(),
    down: new Image(),
    left: new Image(),
    right: new Image(),
}
playerImages.up.src = playerUp
playerImages.down.src = playerDown
playerImages.left.src = playerLeft
playerImages.right.src = playerRight

let imagesLoaded = 0;
const totalImages = 6; // background + foreground + 4 directions

const background = new Sprite({
    position: { x: offset.x, y: offset.y },
    image: image,
    context: c,
})

const foreground = new Sprite({
    position: { x: offset.x, y: offset.y },
    image: foreGroundImage,
    context: c,
})

const player = new Player({
    context: c,
    images: playerImages,
})


const movables = [background, ...boundaries, foreground, ...battleZone]

/**
 * Compte les images chargées et lance la boucle d'animation quand elles le sont toutes.
 * @returns {void}
 */
function tryDraw() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        animate();
    }
}

const onError = (e) => console.error("Erreur de chargement de l'image :", e);

image.onload = tryDraw;
image.onerror = onError;


foreGroundImage.onload = tryDraw;
foreGroundImage.onerror = onError;

Object.values(playerImages).forEach(img => {
    img.onload = tryDraw;
    img.onerror = onError;
})

const keys = {
    z: { pressed: false },
    q: { pressed: false },
    s: { pressed: false },
    d: { pressed: false }
}

/**
 * Teste si deux rectangles se chevauchent.
 * @param {Object} options
 * @param {{position:{x:number,y:number}, width:number, height:number}} options.rect1
 * @param {{position:{x:number,y:number}, width:number, height:number}} options.rect2
 * @returns {boolean}
 */
function rectangularCollision({ rect1, rect2 }) {
    return (
        rect1.position.x < rect2.position.x + rect2.width &&
        rect1.position.x + rect1.width > rect2.position.x &&
        rect1.position.y < rect2.position.y + rect2.height &&
        rect1.position.y + rect1.height > rect2.position.y
    )
}
const battle={
    initiated:false,
    busy:false
}
const battleBackgroundImage = new Image()
battleBackgroundImage.src=backGroundBattleImage;

const backGroundBattle= new Sprite({
    context:c,
    position:{
        x:0,y:0
    },
    image:battleBackgroundImage
})

/**
 * Anime la largeur d'une barre de vie.
 * @param {string} selector Sélecteur CSS de la barre
 * @param {number} health Points de vie restants (0 à 100)
 * @returns {void}
 */
function updateHealthBar(selector, health) {
    gsap.to(selector, {
        width: Math.max(health, 0) + '%'
    })
}

/**
 * Crée un Monster à partir de son entrée dans le catalogue `monsters`.
 * @param {keyof typeof monsters} key Clé du monstre dans `monsters`
 * @param {Object} options
 * @param {{x:number,y:number}} options.position
 * @param {boolean} [options.isEnemy=false]
 * @param {string} options.healthBarSelector Sélecteur CSS de sa barre de vie
 * @returns {Monster}
 */
function createMonster(key, { position, isEnemy = false, healthBarSelector }) {
    const data = monsters[key]
    const monsterImage = new Image()
    monsterImage.src = data.imageSrc

    return new Monster({
        context: c,
        position,
        image: monsterImage,
        frames: data.frames,
        animate: true,
        name: data.name,
        attacks: data.attacks,
        isEnemy,
        onHealthChange: (health) => updateHealthBar(healthBarSelector, health)
    })
}

const draggle = createMonster("draggle", {
    position: { x: 800, y: 100 },
    isEnemy: true,
    healthBarSelector: '#enemyHealthBar'
})
const ember = createMonster("emby", {
    position: { x: 280, y: 325 },
    healthBarSelector: '#playerHealthBar'
})

/**
 * Relance l'animation CSS d'un bouton.
 * @param {HTMLElement} button
 * @param {string} className Classe CSS qui déclenche l'animation
 * @returns {void}
 */
function playButtonAnimation(button, className) {
    button.classList.remove(className)
    void button.offsetWidth
    button.classList.add(className)
}
/**
 * Joue le tour de l'ennemi avec une de ses attaques choisie au hasard.
 * @param {Monster} enemy Monstre qui attaque
 * @param {Monster} target Monstre du joueur
 * @param {()=>void} [onComplete] Appelée quand l'attaque de l'ennemi est terminée
 * @returns {void}
 */
function enemyTurn(enemy, target, onComplete) {
    const attack = enemy.randomAttack()
    if (enemy.health <= 0 || !attack) {
        if (onComplete) onComplete()
        return
    }
    enemy.attack({ attack, recipient: target, onComplete })
}
/**
 * Affiche un message dans la boîte de dialogue du combat.
 * @param {string} message
 * @returns {void}
 */
function showDialogue(message) {
    const dialogueBox = document.querySelector("#dialogueBox")
    dialogueBox.innerHTML = message
    dialogueBox.style.display = "block"

}
/**
 * Vide et cache la boîte de dialogue du combat.
 * @returns {void}
 */
function hideDialogue() {
    const dialogueBox = document.querySelector("#dialogueBox")
    dialogueBox.innerHTML = ""
    dialogueBox.style.display = "none"
}

/**
 * Termine le combat : anime la défaite du monstre à 0 PV, puis affiche le résultat.
 * Les boutons restent bloqués car `battle.busy` n'est pas remis à false.
 * @param {Monster} fainted Monstre qui n'a plus de points de vie
 * @returns {void}
 */
function endBattle(fainted) {
    battle.busy = true
    fainted.faint(() => {
        const result = fainted.isEnemy ? "You won!" : "You lost..."
        showDialogue(`${fainted.name} fainted!<br>${result}`)
    })
}
/**
 * Remplit #attacksBox avec un bouton par attaque du monstre.
 * Chaque bouton a pour id le nom de l'attaque et joue la classe `<nom>-active`.
 * @param {Monster} monster Monstre du joueur
 * @param {Monster} target Monstre adverse
 * @returns {void}
 */
function loadAttackButtons(monster, target) {
    const attacksBox = document.querySelector("#attacksBox")
    const attackTypeLabel = document.querySelector("#attackType")
    attacksBox.innerHTML = ""

    monster.attacks.forEach(attack => {
        const button = document.createElement("button")
        button.id = attack.name
        button.textContent = attack.name

        button.addEventListener("animationend", () => {
            button.classList.remove(`${attack.name}-active`)
        })

        // button.addEventListener("click", () => {
        //     if (monster.isAttacking) return
        //     playButtonAnimation(button, `${attack.name}-active`)
        //     monster.attack({ attack, recipient: target })
        // })

        button.addEventListener("mouseenter", () => {
            attackTypeLabel.textContent = attack.type
        })

        attacksBox.append(button)

        button.addEventListener("click", () => {
            if (battle.busy || monster.isAttacking) return
            battle.busy = true

            playButtonAnimation(button, `${attack.name}-active`)
            monster.attack({
                attack,
                recipient: target,
                onComplete: () => {
                    if (target.health <= 0) {
                        endBattle(target)
                        return
                        
                    }
                    gsap.delayedCall(1, () => {
                        enemyTurn(target, monster, () => {
                            if (monster.health <= 0) {
                                endBattle(monster)
                                return
                            }
                            battle.busy = false
                        })
                    })
                }
            })
        })
    })
}

loadAttackButtons(ember, draggle)

/**
 * Boucle d'animation du combat.
 * @returns {void}
 */
function animateBattle(){
    window.requestAnimationFrame(animateBattle)
    backGroundBattle.draw(canvas)
    draggle.draw(canvas)
    ember.draw(canvas)
    draggle.activeProjectiles.forEach(p => p.draw())
    ember.activeProjectiles.forEach(p => p.draw())
    // console.log("animating battle");
    const userInterfaceElement = document.querySelector("#userInterface")
    userInterfaceElement.style="display:block"    
}

/**
 * Boucle d'animation de la carte : déplacement, collisions et déclenchement des combats.
 * @returns {void}
 */
function animate() {
    
   const  animationId = window.requestAnimationFrame(animate)
    const speed = 3
    let dx = 0, dy = 0
    let direction = null

    
    if (keys.z.pressed) {
        dy = speed
        direction = 'up'
    } else if (keys.q.pressed) {
        dx = speed
        direction = 'left'
    } else if (keys.s.pressed) {
        dy = -speed
        direction = 'down'
    } else if (keys.d.pressed) {
        dx = -speed
        direction = 'right'
    } else {
        player.moving = false
    }
    player.moving=false;
    if (battle.initiated) return true
    if (direction) {
        player.setDirection(direction)

        const playerBox = player.getBox(canvas)

        
        const willCollide = boundaries.some(boundary => {
            return rectangularCollision({
                rect1: playerBox,
                rect2: {
                    position: {
                        x: boundary.position.x + dx,
                        y: boundary.position.y + dy
                    },
                    width: boundary.width,
                    height: boundary.height
                }
            })
        })
       const isInBattleZone = battleZone.some(boundary => {
            const overlappingArea =
                (Math.min(
                    playerBox.position.x + playerBox.width,
                    boundary.position.x + boundary.width
                ) -
                    Math.max(playerBox.position.x, boundary.position.x)) *
                (Math.min(
                    playerBox.position.y + playerBox.height,
                    boundary.position.y + boundary.height
                ) -
                    Math.max(playerBox.position.y, boundary.position.y))

            return rectangularCollision({
                rect1: playerBox,
                rect2: {
                    position: {
                        x: boundary.position.x + dx,
                        y: boundary.position.y + dy
                    },
                    width: boundary.width,
                    height: boundary.height
                }
            }) && overlappingArea > (playerBox.width * playerBox.height) / 2  && Math.random() < 0.03
        })

        // 3. ne bouger que si c'est libre
        if (!willCollide) {
            movables.forEach(movable => {
                movable.position.x += dx
                movable.position.y += dy
            })
        }
        if(isInBattleZone){
            console.log("battle Activated");
             //deactivate current animation loop
            window.cancelAnimationFrame(animationId)
            battle.initiated=true
            gsap.to('#overlappingDiv',{
                opacity:0.95,
                repeat:3,
                yoyo:true,
                duration:.4,
                onComplete(){
                    gsap.to("#overlappingDiv",{
                        opacity:1,
                        duration:.4,
                        onComplete(){
                            gsap.to("#overlappingDiv",{
                                opacity:0,
                                duration:.4
                            })
                            //activate a new animation loop
                            hideDialogue()
                            animateBattle()
                            
                        }
                    })
                    
                   
                }
            }) 
              
        }
    }

    c.fillStyle = "white";
    c.fillRect(0, 0, canvas.width, canvas.height);

    background.draw()
    // boundaries.forEach(boundary => {
    //     boundary.draw()
    // })

   
    // battleZone.forEach(boundary => {
    //     boundary.draw()
    // })
    player.draw(canvas)
    foreground.draw()
}


window.addEventListener("keydown", e => {
    switch (e.key.toLowerCase()) {
        case "z":
            keys.z.pressed = true
            break;
        case "q":
            keys.q.pressed = true
            break;
        case "s":
            keys.s.pressed = true
            break;
        case "d":
            keys.d.pressed = true
            break;
    }
})
// window.addEventListener("keydown", e => {
//     if (e.key.toLowerCase() === "e") {
//         if (draggle.isAttacking) return
//         const attack = draggle.randomAttack()
//         if (attack) draggle.attack({ attack, recipient: ember })
//     }
// })
window.addEventListener("keyup", e => {
    switch (e.key.toLowerCase()) {
        case "z":
            keys.z.pressed = false
            break;
        case "q":
            keys.q.pressed = false
            break;
        case "s":
            keys.s.pressed = false
            break;
        case "d":
            keys.d.pressed = false
            break;
    }
})