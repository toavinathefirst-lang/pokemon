/**
 * @typedef {Object} FramesConfig
 * @property {number} max
 * @property {number} hold
 */

/**
 * @typedef {Object} AttackData
 * @property {string} name
 * @property {number} damage
 * @property {"normal"|"fire"|"water"|"grass"} type
 * @property {"melee"|"projectile"} animation
 * @property {HTMLImageElement} [image]
 * @property {FramesConfig} [frames]
 */

/**
 * @typedef {Object} MonsterData
 * @property {string} name
 * @property {string} imageSrc
 * @property {FramesConfig} frames
 * @property {AttackData[]} attacks
 */

export {}