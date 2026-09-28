import fireballSrc from '../assets/chrisCourseAssets/ChrisCoursesPokemon/Images/fireball.png'

const fireballImage = new Image()
fireballImage.src = fireballSrc

/**
 * @type {Record<string, import('./types').AttackData>}
 */
export const attacks = {
    tackle: {
        name: "tackle",
        damage: 10,
        type: "normal",
        animation: "melee",
    },
    fireball: {
        name: "fireball",
        damage: 15,
        type: "fire",
        animation: "projectile",
        image: fireballImage,
        frames: { max: 4, hold: 6 },
    },
}