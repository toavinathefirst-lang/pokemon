import fireballSrc from '../assets/chrisCourseAssets/ChrisCoursesPokemon/Images/fireball.png'

const fireballImage = new Image()
fireballImage.src = fireballSrc

/**
 * Catalogue de toutes les attaques du jeu, indexées par clé.
 * @type {Record<string, import('./types').AttackData>}
 */
export const attacksList = {
    tackle: {
        name: "tackle",
        damage: 10,
        type: "normal",
    },
    fireball: {
        name: "fireball",
        damage: 15,
        type: "fire",
        image: fireballImage,
        frames: { max: 4, hold: 6 },
    },
}