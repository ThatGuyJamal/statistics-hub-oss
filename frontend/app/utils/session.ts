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

import { createCookieSessionStorage } from "@remix-run/node";
import { environment } from "~/config";
import { Milliseconds } from "./time";

let sessionSecret = environment.session_secret;

if (!sessionSecret) {
  throw new Error("Session secret not set");
}

let storage = createCookieSessionStorage({
  cookie: {
    name: "shub-oss-user-session",
    secure: true,
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: Milliseconds.Hour * 12,
    httpOnly: true,
  },
});

export { storage };
