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
