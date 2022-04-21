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
 * Gets the maximum value.
 * @param values The values to compare.
 * @returns The maximum value.
 */
export function max<N extends number | bigint>(...values: readonly N[]): N {
  if (values.length === 0) throw new TypeError("Expected at least 1 value.");

  let lowest = values[0];
  for (let i = 1; i < values.length; ++i) {
    const value = values[i];
    if (value > lowest) lowest = value;
  }

  return lowest;
}
