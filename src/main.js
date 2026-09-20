import './style.css'
import { battleZonesData } from './data/battleZone';
import { collisions } from './data/collisionMap';
import { charactersMapData } from './data/characters';
const canvas = document.querySelector("canvas");
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576
const collisionMap = []
for (let index = 0; index < collisions.length; index++) {
    collisionMap.push(collisions.slice(index,70+index))
}
const battleZonesMap = []
for (let index = 0; index < battleZonesData.length; index++) {
    battleZonesMap.push(battleZonesData.slice(index,70+index))
}
const charactersMap = []
for (let i = 0; i < charactersMapData.length; i += 70) {
  charactersMap.push(charactersMapData.slice(i, 70 + i))
}

console.log(charactersMap)
