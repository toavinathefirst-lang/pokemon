import './style.css'
import petTownUrl from './assets/chrisCourseAssets/ChrisCoursesPokemon/Tiled/Pellet TownZoom.png'

const canvas = document.querySelector("canvas");
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillStyle="white"
c.fillRect(0,0,canvas.width,canvas.height)
const image = new Image();
image.src = petTownUrl;

image.onload = () => {
    c.drawImage(image, -750, -550)
}

image.onerror = (e) => {
    console.error("Erreur de chargement de l'image :", e)
}