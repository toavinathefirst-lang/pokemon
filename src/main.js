//mienne
import './style.css'
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

const canvas = document.querySelector("canvas");
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const collisionArray = []
for (let i = 0; i < collisionMap.length; i += 70) {
    collisionArray.push(collisionMap.slice(i, 70 + i))
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

const image = new Image();
const foreGroundImage = new Image();
foreGroundImage.src=foreGroundObject
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
const totalImages = 5; // background + 4 directions

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

const movables = [background, ...boundaries,foreground]

function tryDraw() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        animate();
    }
}

image.onload = tryDraw;
image.onerror = (e) => console.error("Erreur de chargement de l'image :", e);

Object.values(playerImages).forEach(img => {
    img.onload = tryDraw;
    img.onerror = (e) => console.error("Erreur de chargement de l'image :", e);
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

function animate() {
    window.requestAnimationFrame(animate)
    const speed = 3
    let dx = 0, dy = 0
    let direction = null
    // 1. mettre à jour la direction/position AVANT de dessiner
    // 1. déterminer le déplacement prévu ET la direction, SANS encore bouger
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
    }
    if (direction) {
        player.setDirection(direction)

        const playerBox = player.getBox(canvas)

        // 2. vérifier si CE déplacement causerait une collision
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

        // 3. ne bouger que si c'est libre
        if (!willCollide) {
            movables.forEach(movable => {
                movable.position.x += dx
                movable.position.y += dy
            })
        }
    }
    c.fillStyle = "white";
    c.fillRect(0, 0, canvas.width, canvas.height);

    background.draw()
    // boundaries.forEach(bundary => {
    //     boundary.draw()
    // })
    
    player.draw(canvas)
    foreground.draw(canvas)
}

window.addEventListener("keydown", e => {
    switch (e.key) {
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
    switch (e.key) {
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