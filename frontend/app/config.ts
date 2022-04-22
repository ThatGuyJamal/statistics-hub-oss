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

/**
 * Our project configuration
 */
export const environment = {
    production: process.env.production,
    mongodbUrl: process.env.mongodbUrl,
    website_root_title: process.env.website_root_title,
    website_root_description: process.env.website_root_description,
    session_secret: process.env.session_secret,
    development_mode: process.env.development_mode,
}