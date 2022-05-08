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

import { type CpuInfo, cpus, uptime } from "node:os";
import { roundNumber } from "@sapphire/utilities";
import {
  ApplicationCommandRegistry,
  BucketScope,
  ChatInputCommand,
  RegisterBehavior,
  version as sapphireVersion,
  version,
} from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Message } from "discord.js";
import { ENV } from "../../config";
import { time, TimestampStyles } from "@discordjs/builders";
import { ICommand, ICommandOptions } from "../../lib/client/command";
import { BrandingColors } from "../../lib/utils/colors";
import { BaseEmbed } from "../../lib/utils/embed";
import { createHyperLink } from "../../lib/utils/format";
import { seconds } from "../../lib/utils/time";
import { getTestGuilds } from "../../lib/utils/utils";

@ApplyOptions<ICommandOptions>({
  description: "Shows information about the bot.",
  cooldownDelay: seconds(10),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  extendedDescription: {
    command_type: "both",
  },
})
export class UserCommand extends ICommand {
  // Message Based Command
  public async messageRun(ctx: Message) {
    return ctx.reply({ embeds: [this.buildEmbed()] });
  }
  // Slash Based Command
  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) {
    return interaction.reply({ embeds: [this.buildEmbed()], ephemeral: true });
  }

  private buildEmbed(): BaseEmbed {
    const titles = {
      stats: "Statistics",
      uptime: "Uptime",
      serverUsage: "Server Usage",
      globalStats: "Global Statistics",
      developer: "Development",
    };
    const stats = this.generalStatistics;
    const uptime = this.uptimeStatistics;
    const usage = UserCommand.usageStatistics;
    //  const global = this.clientStatistics;

    const fields = {
      stats: `• **Users**: ${stats.users}\n• **Guilds**: ${stats.guilds}\n• **Channels**: ${stats.channels}\n• **Discord.js**: ${stats.version}\n• **Node.js**: ${stats.nodeJs}\n• **Sapphire Framework**: ${stats.sapphireVersion}`,
      uptime: `• **Host**: ${uptime.host}\n• **Total**: ${uptime.total}\n• **Client**: ${uptime.client}`,
      serverUsage: `• **CPU Load**: ${usage.cpuLoad}\n• **Heap**: ${usage.ramUsed}MB (Total: ${usage.ramTotal}MB)`,
      developer: `• **Name**: __${ENV.developer.name}__\n• **GitHub**: ${createHyperLink(
        "repository",
        ENV.developer.github_link
      )}\n• **Discord**: ${createHyperLink("link", ENV.bot.server_link)}\n • **Dashboard**: ${createHyperLink(
        "link",
        ENV.developer.dashboard_link
      )}`,
    };

    return new BaseEmbed({
      footer: {
        text: `Enjoy your day!`,
      },
    })
      .setColor(BrandingColors.Primary)
      .addField(titles.stats, fields.stats)
      .addField(titles.uptime, fields.uptime)
      .addField(titles.serverUsage, fields.serverUsage)
      .addField(titles.developer, fields.developer)
      .setThumbnail(this.container.client.user?.displayAvatarURL() ?? "");
  }

  private async clientStatistics() {
    return await this.container.client.StatisticsHandler.statcordGet();
  }

  private get generalStatistics(): StatsGeneral {
    const { client } = this.container;
    return {
      channels: client.channels.cache.size,
      guilds: client.guilds.cache.size,
      nodeJs: process.version,
      users: client.guilds.cache.reduce((acc, val) => acc + (val.memberCount ?? 0), 0),
      version: `v${version}`,
      sapphireVersion: `v${sapphireVersion}`,
    };
  }

  private get uptimeStatistics(): StatsUptime {
    const now = Date.now();
    const nowSeconds = roundNumber(now / 1000);
    return {
      client: time(seconds.fromMilliseconds(now - this.container.client.uptime!), TimestampStyles.RelativeTime),
      host: time(roundNumber(nowSeconds - uptime()), TimestampStyles.RelativeTime),
      total: time(roundNumber(nowSeconds - process.uptime()), TimestampStyles.RelativeTime),
    };
  }

  private static get usageStatistics(): StatsUsage {
    const usage = process.memoryUsage();
    return {
      cpuLoad: cpus().map(UserCommand.formatCpuInfo.bind(null)).join(" | "),
      ramTotal: `${(usage.heapTotal / 1048576).toFixed(2)}`,
      ramUsed: `${(usage.heapUsed / 1048576).toFixed(2)}`,
    };
  }

  private static formatCpuInfo({ times }: CpuInfo) {
    return `${roundNumber(((times.user + times.nice + times.sys + times.irq) / times.idle) * 10000) / 100}%`;
  }

  // slash command registry
  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
      guildIds: getTestGuilds(),
      registerCommandIfMissing: ENV.bot.register_commands,
      behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
      idHints: ["964236972241600522"],
    });
  }
}

interface StatsGeneral {
  channels: number;
  guilds: number;
  nodeJs: string;
  users: number;
  version: string;
  sapphireVersion: string;
}

interface StatsUptime {
  client: string;
  host: string;
  total: string;
}

interface StatsUsage {
  cpuLoad: string;
  ramTotal: string;
  ramUsed: string;
}

interface StatsCommand {
  commands_ran: number;
  blacklisted_guilds: number;
  blacklisted_users: number;
  errors_triggered: number;
}
