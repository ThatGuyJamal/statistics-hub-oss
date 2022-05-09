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

import "@sapphire/plugin-logger/register";
import "@sapphire/plugin-i18next/register";
import "@kaname-png/plugin-statcord/register";
import "@sapphire/plugin-hmr/register";

import { container } from "@sapphire/framework";
import { BotClient } from "./Bot";

console.clear();

async function bootstrap(): Promise<void> {
  await BotClient.startClient();
}

bootstrap()
  .then(() => {
    container.logger.info("Bootstrap complete! All services are online!");
  })
  .catch((err) => {
    container.logger.error(err);
  });
