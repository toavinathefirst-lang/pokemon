import './style.css'
import gsap from 'gsap'

import petTownUrl from './assets/chrisCourseAssets/ChrisCoursesPokemon/Tiled/Pellet TownZoom.png'
import playerDown from './assets/chrisCourseAssets/ChrisCoursesPokemon/Images/playerDown.png'
import playerUp from "./assets/chrisCourseAssets/ChrisCoursesPokemon/Images/playerUp.png"
import playerLeft from "./assets/chrisCourseAssets/ChrisCoursesPokemon/Images/playerLeft.png"
import playerRight from "./assets/chrisCourseAssets/ChrisCoursesPokemon/Images/playerRight.png"
import foreGroundObject from "./assets/chrisCourseAssets/ChrisCoursesPokemon/Tiled/foreground object.png"

import { Sprite } from './sprite';
import { Boundary } from './boundary'
import { Player } from './player'

import { collisionMap } from './data/collisions'
import { battleZoneArray } from './data/battleZone'

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

function rectangularCollision({ rect1, rect2 }) {
    return (
        rect1.position.x < rect2.position.x + rect2.width &&
        rect1.position.x + rect1.width > rect2.position.x &&
        rect1.position.y < rect2.position.y + rect2.height &&
        rect1.position.y + rect1.height > rect2.position.y
    )
}
const battle={
    initiated:false
}
function animateBattle(){
    window.requestAnimationFrame(animateBattle)
    
    // console.log("animating battle");
    
}
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
                        duration:.4
                    })
                    //activate a new animation loop
                   animateBattle()
                   
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

   
    battleZone.forEach(boundary => {
        boundary.draw()
    })
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