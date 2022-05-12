/**
 * Picks a random value from an array.
 * @param array The array to pick from.
 * @returns {any} The random value from the array.
 */
export function pickRandom(array: Array<any>) {
  if (!array) throw new Error("No array was provided!");
  return array[Math.floor(Math.random() * array.length)];
}
