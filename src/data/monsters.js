import { attacks } from './attacks'
import draggleSrc from '../assets/chrisCourseAssets/ChrisCoursesPokemon/Images/draggleSprite.png'
import embySrc from '../assets/chrisCourseAssets/ChrisCoursesPokemon/Images/embySprite.png'

/**
 * @type {Record<string, import('./types').MonsterData>}
 */
export const monsters = {
    emby: {
        name: "Emby",
        imageSrc: embySrc,
        frames: { max: 4, hold: 30 },
        attacks: [attacks.tackle, attacks.fireball],
    },
    draggle: {
        name: "Draggle",
        imageSrc: draggleSrc,
        frames: { max: 4, hold: 30 },
        attacks: [attacks.tackle],
    },
}