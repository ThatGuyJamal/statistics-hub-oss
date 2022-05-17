/**
 * A function that checks if a provided argument matches one of the provided arguments in an array.
 * Useful for our config legacy commands which need to check user input against a list of valid arguments.
 * @param userInput The user input to check.
 * @param validArguments The valid arguments to check against.
 */
export function ProcessLegacySubCommands(userInput: any, validInput: any[]): boolean {
  return validInput.includes(userInput);
}
