import './style.css'
import petTownUrl from './assets/chrisCourseAssets/ChrisCoursesPokemon/Tiled/Pellet TownZoom.png'
import playerDown from './assets/chrisCourseAssets/ChrisCoursesPokemon/Images/playerDown.png'
import playerUp from "./assets/chrisCourseAssets/ChrisCoursesPokemon/Images/playerUp.png"
import playerLeft from "./assets/chrisCourseAssets/ChrisCoursesPokemon/Images/playerLeft.png"
import playerRight from "./assets/chrisCourseAssets/ChrisCoursesPokemon/Images/playerRight.png"
import { Sprite } from './classes';

const canvas = document.querySelector("canvas");
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillStyle = "white"
c.fillRect(0, 0, canvas.width, canvas.height)

const image = new Image();
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

let currentPlayerImage = playerImages.d

let imagesLoaded = 0;
const totalImages = 5; // background + 4 directions

const background = new Sprite({
    position: { x: -735, y: -590 },
    image: image,
    context: c,
})

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
    z: {
        pressed: false
    },
    q: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

function animate() {
    window.requestAnimationFrame(animate)

    // 1. mettre à jour la direction/position AVANT de dessiner
    if (keys.z.pressed) {
        background.position.y += 3
        currentPlayerImage = playerImages.up
    } else if (keys.q.pressed) {
        background.position.x += 3
        currentPlayerImage = playerImages.left
    } else if (keys.s.pressed) {
        background.position.y -= 3
        currentPlayerImage = playerImages.down
    } else if (keys.d.pressed) {
        background.position.x -= 3
        currentPlayerImage = playerImages.right
    }

    // 2. dessiner ensuite, avec l'état à jour
    c.fillStyle = "white";
    c.fillRect(0, 0, canvas.width, canvas.height);

    background.draw()

    c.drawImage(
        currentPlayerImage,
        0, 0,
        currentPlayerImage.width / 4,
        currentPlayerImage.height,
        canvas.width / 2 - (currentPlayerImage.width / 4) / 2,
        canvas.height / 2 - currentPlayerImage.height / 2,
        currentPlayerImage.width / 4,
        currentPlayerImage.height
    );
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