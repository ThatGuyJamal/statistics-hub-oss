/**
  Statistics Hub OSS - A data analytics discord bot.
    
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

import Consola from "consola";
import { environment } from "../config";

/**
 * Internal Logger Object. This is used to log messages to the console.
 */
export const Logger = {
  info(message: string) {
    Consola.info(message);
  },
  error(message: string) {
    Consola.error(message);
  },
  warn(message: string) {
    Consola.warn(message);
  },
  debug(message: string) {
    if (environment.bot.dev) {
      Consola.debug(message);
    }
  },
  success(message: string) {
    Consola.success(message);
  },
  log(message: string) {
    Consola.log(message);
  },
  fatal(message: string) {
    Consola.fatal(message);
  },
  trace(message: string) {
    Consola.trace(message);
  },
  clear() {
    console.clear();
  },
  getLogger() {
    return Consola;
  },
};

export interface LoggerType {
  info(message: string): void;
  error(message: string): void;
  warn(message: string): void;
  debug(message: string): void;
  success(message: string): void;
  log(message: string): void;
  fatal(message: string): void;
  trace(message: string): void;
  clear(): void;
  getLogger(): typeof Consola;
}
