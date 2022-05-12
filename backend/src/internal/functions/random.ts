/**
 *  Statistics Hub OSS - A data analytics discord bot.
    
    Copyright (C) 2022, ThatGuyJamal and contributors
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU Affero General Public License for more details.
 */

/**
 * Picks a random value from an array.
 * @param array The array to pick from.
 * @returns {any} The random value from the array.
 */
export function pickRandom(array: Array<any>) {
  if (!array) throw new Error("No array was provided!");
  return array[Math.floor(Math.random() * array.length)];
}
