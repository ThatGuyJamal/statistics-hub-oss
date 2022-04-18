import { container } from "@sapphire/framework";

/** Loads our config members to cache */
export function loadImportantMembers(): void {
  for (const devId of container.client.environment.developer.discord_dev_ids) {
    container.client.BotDevelopers.add(devId);
    container.logger.info(`Added ${devId} to Bot Developers`);
  }

  for (const supportId of container.client.environment.developer.discord_support_ids) {
    container.client.BotSupporters.add(supportId);
    container.logger.info(`Added ${supportId} to Bot Supporters`);
  }

  for (const staffId of container.client.environment.developer.discord_staff_ids) {
    container.client.BotStaff.add(staffId);
    container.logger.info(`Added ${staffId} to Bot Staff`);
  }
}
