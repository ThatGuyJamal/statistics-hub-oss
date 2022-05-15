import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener, ListenerOptions, MessageCommand } from "@sapphire/framework";
import { RateLimit } from "@sapphire/ratelimits";
import { Message, TextChannel } from "discord.js";
import { channelMention, memberMention, roleMention } from "../../internal/functions/formatting";
import { isGuildMessage } from "../../internal/functions/guards";

@ApplyOptions<ListenerOptions>({
  name: "customcommand-event",
  event: Events.MessageCreate,
})
export class UserEvent extends Listener {
  public async run(message: Message){
    // TODO - Add role, user, and channel limitations

    if (message.partial || !isGuildMessage(message) || message.author.bot) return;

    const ratelimit = this.container.client.RateLimitAPI.customCommandLimiter.acquire(message.author.id);

    // If we are limited, dont run the command.
    if (ratelimit.limited) return;

    const channel = message.channel as TextChannel;

    if (channel.type !== "GUILD_TEXT") return;

    const fetchedCache = this.container.client.LocalCacheStore.memory.plugins.commands.get(channel.guild);

    if (!fetchedCache) return;

    const fetchPrefix =
      this.container.client.LocalCacheStore.memory.guild.get(channel.guild)?.GuildPrefix ||
      this.container.client.environment.bot.bot_prefix;

    // Check if the command started with the prefix
    if (!message.content.startsWith(fetchPrefix)) return;

    // Checks if there are any commands in the array
    if (!fetchedCache.GuildCustomCommands || fetchedCache.GuildCustomCommands.data.length < 1) return;

    // Get the trigger name out of the message content
    const trigger = message.content.split(" ")[0].slice(fetchPrefix.length);

    // Check if the command is a custom command
    const customCommand = fetchedCache.GuildCustomCommands.data.find((c) => c.trigger === trigger);

    if (!customCommand) return;

    // Check if the trigger name after the prefix has been removed, is the same as the custom command name.
    if (trigger !== customCommand.trigger) return;

    // Check if we have permissions in this channel to send messages
    if (!channel.permissionsFor(message.guild?.me!).has("SEND_MESSAGES")) return;

    /**
     * ? Permission handler. 
     * Here we will check if the user has the required role, channel, or user Id to run the command.
     * Permission order: User, Role, Channel
     */

    if (customCommand.allowedUser && message.author.id !== customCommand.allowedUser) {
      return message.channel.send(
        {
          content: `:lock: ${memberMention(message.author.id)} | Only ${memberMention(customCommand.allowedUser)} can use this command.`,
          allowedMentions: {
            users: []
          }
        }
      );
    }

    if (customCommand.allowedRole && !message.member?.roles.cache.has(customCommand.allowedRole)) {
      return message.channel.send(
        {
          content: `:lock: ${memberMention(message.author.id)} |  Only members with the ${roleMention(customCommand.allowedRole)} role can use this command.`,
          allowedMentions: {
            roles: []
          }
        }
      );
    }

    if (customCommand.allowedChannel && message.channel.id !== customCommand.allowedChannel) {
      return message.channel.send(
        `:lock: ${memberMention(message.author.id)} | This custom command can only be used in the ${channelMention(customCommand.allowedChannel)} channel.`
      );
    }

    // Removes one limit from the user
    ratelimit.consume();

    return await channel
      .send(
        customCommand.response
          .replaceAll("{{user.mention}}", memberMention(message.author.id))
          .replaceAll("{{user.username}}", message.author.username)
          .replaceAll("{{user.id}}", message.author.id)
          .replaceAll("{{user.tag}}", message.author.tag)
          .replaceAll("{{server.memberCount}}", message.guild!.memberCount.toString())
          .replaceAll("{{server.name}}", message.guild!.name)
          .replaceAll("{{server.id}}", message.guild!.id)
      )
      .catch(() => {});
  }
}
