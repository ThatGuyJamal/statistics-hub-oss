import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener, ListenerOptions, MessageCommand } from "@sapphire/framework";
import { Message, TextChannel } from "discord.js";
import { memberMention } from "../../internal/functions/formatting";

@ApplyOptions<ListenerOptions>({
  name: "customcommand-event",
  event: Events.MessageCreate,
})
export class UserEvent extends Listener {
  public async run(message: Message): Promise<void> {
    // TODO - Add role, user, and channel limitations

    if (message.author.bot) return;

    const channel = message.channel as TextChannel;

    if (channel.type !== "GUILD_TEXT") return;

    const fetchedCache = this.container.client.LocalCacheStore.memory.plugins.commands.get(channel.guild);

    const fetchPrefix =
      this.container.client.LocalCacheStore.memory.guild.get(channel.guild)?.GuildPrefix ||
      this.container.client.environment.bot.bot_prefix;

    if (!fetchedCache) return;

    // Checks if there are any commands in the array
    if (!fetchedCache.GuildCustomCommands || fetchedCache.GuildCustomCommands.data.length < 1) return;

    // Get the trigger name out of the message content
    const trigger = message.content.split(" ")[0].slice(fetchPrefix.length);

    // Check if the command is a custom command
    const customCommand = fetchedCache.GuildCustomCommands.data.find((c) => c.trigger === trigger);

    if (!customCommand) return;

    // Check if the command started with the prefix
    if (!message.content.startsWith(fetchPrefix)) return;

    // Check if the trigger is the same as the custom command
    if (trigger !== customCommand.trigger) return;

    // Send the custom command message to the channel

    // Check if we have permissions in this channel to send messages
    if (!channel.permissionsFor(message.guild?.me!).has("SEND_MESSAGES")) return;

    await channel
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


// TODO Cooldown for custom commands
// outline
const customCommandCooldown = new Map<string, number>();