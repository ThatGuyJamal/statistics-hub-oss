import { Constants } from "discord.js";

export const enum Colors {
  White = 0xe7e7e8,
  Amber = 0xffc107,
  Amber300 = 0xffd54f,
  Blue = 0x2196f3,
  BlueGrey = 0x607d8b,
  Brown = 0x795548,
  Cyan = 0x00bcd4,
  DeepOrange = 0xff5722,
  DeepPurple = 0x673ab7,
  Green = 0x4caf50,
  Grey = 0x9e9e9e,
  Indigo = 0x3f51b5,
  LightBlue = 0x03a9f4,
  LightGreen = 0x8bc34a,
  Lime = 0xcddc39,
  Lime300 = 0xdce775,
  Orange = 0xff9800,
  Pink = 0xe91e63,
  Purple = 0x9c27b0,
  Red = 0xf44336,
  Red300 = 0xe57373,
  Teal = 0x009688,
  Yellow = 0xffeb3b,
  Yellow300 = 0xfff176,
}

/**
 * Takes a color and returns its css attribute
 * @param color
 */
export function colorToStyle(color: Colors): string {
  return `color: #${color.toString(16)}`;
}

export enum BrandingColors {
  Primary = Constants.Colors.WHITE,
  Secondary = Constants.Colors.BLURPLE,
  Error = Constants.Colors.RED,
  Legacy = Constants.Colors.DARK_BUT_NOT_BLACK,
}
