import { ApplyOptions } from "@sapphire/decorators";
import { BucketScope, ApplicationCommandRegistry, RegisterBehavior, ChatInputCommand, Args } from "@sapphire/framework";
import { codeBlock } from "@sapphire/utilities";
import { Message } from "discord.js";
import { ICommandOptions, ICommand } from "../../Command";
import { environment } from "../../config";
import { CommandPluginMongoModel } from "../../database/models/command";
import { seconds } from "../../internal/functions/time";
import { getTestGuilds } from "../../internal/load-test-guilds";
import { BaseEmbed } from "../../internal/structures/Embed";

const subCommandList = [
    "enable",
    "disable",
    "enable-channel",
    "disable-channel",
    "e",
    "d",
    "ec",
    "dc",
    "list",
    "l",
]

const messageCommandNoSubCommandReply = codeBlock("css", `
=== Syntax ===
[subcommand] [type] [value] (value)

=== Subcommands ===
enable: Enables a command.
disable: Disables a command.
enable-channel: Enables a command in a channel.
disable-channel: Disables a command in a channel.

=== Subcommand Aliases ===
e: enable
d: disable
ec: enable-channel
dc: disable-channel
l: list

=== Examples ===
command e ping => Enables the ping command.
command d ping => Disables the ping command.
command ec ping #general => Enables the ping command in the #general channel.
command dc ping #general => Disables the ping command in the #general channel.
`)

@ApplyOptions<ICommandOptions>({
    aliases: ["cmd"],
    description: "Configure the command plugin.",
    cooldownDelay: seconds(10),
    cooldownScope: BucketScope.User,
    cooldownLimit: 2,
    runIn: "GUILD_TEXT",
    nsfw: false,
    enabled: true,
    extendedDescription: {
        usage: "command [enable/disable] [command-name]",
        examples: ["command d <command>", "command e <command>", "command dc <command> <channel>", "command ec <command> <channel>"],
        command_type: "both",
        subcommands: ["enable", "disable", "delete", "list"]
    },
    requiredUserPermissions: ["MANAGE_GUILD"],
})
export class UserCommand extends ICommand {

    public async messageRun(ctx: Message, args: Args) {
        if (!ctx.guild) return;
        const { client } = this.container

        const subCommand = await args.pick("string").catch(() => null);

        // Check if the subcommand is valid
        if(!subCommand) {
            return ctx.reply({
                embeds: [
                    new BaseEmbed().contextEmbed({
                        description: messageCommandNoSubCommandReply
                    }, ctx)
                ]
            })
        }

        //Check if the first argument was a valid subcommand
        if (!subCommandList.includes(subCommand)) {
            return ctx.reply({
                embeds: [
                    new BaseEmbed().contextEmbed({
                        description: messageCommandNoSubCommandReply
                    }, ctx)
                ]
            })
        }

        const commandCache = client.LocalCacheStore.memory.plugins.commands.get(ctx.guild!);
        const document = await CommandPluginMongoModel.findOne({ GuildId: ctx.guild.id });

        if (!commandCache) {
            client.LocalCacheStore.memory.plugins.commands.set(ctx.guild, {
                GuildId: ctx.guild.id,
                GuildName: ctx.guild.name,
                GuildOwnerId: ctx.guild.ownerId,
                GuildCustomCommands: {
                    data: [],
                    limit: 5,
                },
                GuildDisabledCommandChannels: [],
                GuildDisabledCommands: [],
                CreatedAt: new Date(),
            });
        }

        if (!document) {
            await CommandPluginMongoModel.create({
                GuildId: ctx.guild.id,
                GuildName: ctx.guild.name,
                GuildOwnerId: ctx.guild.ownerId,
                GuildCustomCommands: {
                    data: [],
                    limit: 5,
                },
                GuildDisabledCommandChannels: [],
                GuildDisabledCommands: [],
                CreatedAt: new Date(),
            })
        }

        if(subCommand === "enable" || subCommand === "e") {
            const command = await args.pick("string")
        }

        return
    }
    // public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) { }
    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
            guildIds: getTestGuilds(),
            registerCommandIfMissing: environment.bot.register_commands,
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
            idHints: [],
        });
    }
}