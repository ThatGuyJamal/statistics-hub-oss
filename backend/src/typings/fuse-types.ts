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

// code below was taken from: https://github.com/Lioness100/sapphire-template/blob/e2bccc270db641245160bedbd2f06fffe55bffe9/src/lib/types/fuse.basic.d.ts

// `fuse.basic` essentially removes the ability to parse special query syntax, which is unneeded for our use-case.
// Theoretically this should make searches faster.
declare module "fuse.js/dist/fuse.basic.min.js" {
  // All types are the same.
  export { default } from "fuse.js";
}
