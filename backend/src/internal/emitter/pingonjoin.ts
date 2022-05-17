import { GuildMember, TextChannel } from "discord.js";
import { memberMention } from "../functions/formatting";
import { seconds } from "../functions/time";
import { SapphireClient } from "@sapphire/framework";
import { CustomEventEmitter, customPluginEvents } from ".";

export function pingOnJoinEvent() {
  CustomEventEmitter.on(customPluginEvents.PING_TO_JOIN, async (client: SapphireClient, member: GuildMember) => {
    const cachedData = client.LocalCacheStore.memory.guild.get(member.guild);

    if (!cachedData) return;

    if (!cachedData.GuildPingOnJoinChannels) return;

    // Loop through all channels and ping the user if they join

    for (const channel of cachedData.GuildPingOnJoinChannels) {
      const channelToPing = (await member.guild?.channels.cache.get(channel)) as TextChannel;

      if (!channelToPing) return;

      const sent = await channelToPing.send(`${memberMention(member.id)}`);

      // Delete the ping message after 1 second
      setTimeout(() => sent.delete().catch(() => { }), seconds(1));
    }
  });
}
