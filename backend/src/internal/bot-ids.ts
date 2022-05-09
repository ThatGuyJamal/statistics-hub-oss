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

import { container } from "@sapphire/framework";

/** Loads our config members to cache */
export function loadImportantMembers(): void {
  for (const devId of container.client.environment.bot.developerMetaData.discord_dev_ids) {
    container.client.BotDevelopers.add(devId);
    container.logger.info(`Added ${devId} to Bot Developers`);
  }

  for (const supportId of container.client.environment.bot.developerMetaData.discord_support_ids) {
    container.client.BotSupporters.add(supportId);
    container.logger.info(`Added ${supportId} to Bot Supporters`);
  }

  for (const staffId of container.client.environment.bot.developerMetaData.discord_staff_ids) {
    container.client.BotStaff.add(staffId);
    container.logger.info(`Added ${staffId} to Bot Staff`);
  }
}
