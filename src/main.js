import './style.css'
import petTownUrl from './assets/chrisCourseAssets/ChrisCoursesPokemon/Tiled/Pellet TownZoom.png'
import playerDown from './assets/chrisCourseAssets/ChrisCoursesPokemon/Images/playerDown.png'
const canvas = document.querySelector("canvas");
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillStyle="white"
c.fillRect(0,0,canvas.width,canvas.height)
const image = new Image();
image.src = petTownUrl;
const playerImage = new Image()
playerImage.src =playerDown
image.onload = () => {
    c.drawImage(image, -750, -550)
    c.drawImage(playerImage,0,0,playerImage.width/4,
        playerImage.height,canvas.width/2 -playerImage.width/4  /2 ,
        canvas.height /2 - playerImage.height/2,
        playerImage.width/4,
        playerImage.height
    )   

}

image.onerror = (e) => {
    console.error("Erreur de chargement de l'image :", e)
}
