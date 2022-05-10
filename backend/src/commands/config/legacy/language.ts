import { ApplyOptions } from "@sapphire/decorators";
import { Args, BucketScope } from "@sapphire/framework";
import { Message, TextChannel } from "discord.js";
import { ICommandOptions, ICommand } from "../../../Command";
import { GuildsMongoModel, supportedLanguagesArray } from "../../../database/models/guild";
import { codeBlock } from "../../../internal/functions/formatting";
import { seconds } from "../../../internal/functions/time";
import { BaseEmbed } from "../../../internal/structures/Embed";

const langsWeCanUse = supportedLanguagesArray

@ApplyOptions<ICommandOptions>({
    description: "Configure the bot's language.",
    aliases: ["lang", "setlang", "slang"],
    cooldownDelay: seconds(10),
    cooldownScope: BucketScope.User,
    cooldownLimit: 2,
    runIn: "GUILD_TEXT",
    nsfw: false,
    enabled: true,
    extendedDescription: {
        usage: "language <option>",
        examples: ["language es-ES", "language en-US"],
        command_type: "message",
    },
    requiredUserPermissions: ["MANAGE_GUILD"],
})
export class UserCommand extends ICommand {
    public async messageRun(ctx: Message, args: Args) {
        const { client } = this.container;

        const newLang = await args.pick("string").catch(() => null);

        if (!newLang) {
            let currentLang = client.LocalCacheStore.memory.guild.get(ctx.guild!)?.GuildLanguage;
            let currentPrefix = client.LocalCacheStore.memory.guild.get(ctx.guild!)?.GuildPrefix;
            return ctx.reply({
                content: await this.translate(ctx.channel as TextChannel, "commands/config:language_command.missing_args"),
                embeds: [
                    new BaseEmbed().contextEmbed({
                        description: await this.translate(
                            ctx.channel as TextChannel,
                            "commands/config:language_command.current_language",
                            {
                                language: currentLang ?? client.environment.bot.bot_language,
                            }
                        ),
                        fields: [
                            {
                                name: "reset",
                                value: await this.translate(
                                    ctx.channel as TextChannel,
                                    "commands/config:language_command.reset_language_info",
                                    {
                                        prefix: currentPrefix ?? client.environment.bot.bot_prefix,
                                    }
                                ),
                                inline: true,
                            },
                        ],
                    }, ctx)
                ],
            });
        } else if (newLang === "reset") {
            // Removing the language from the cache and setting it to undefined
            let oldCache = client.LocalCacheStore.memory.guild.get(ctx.guild!);
                client.LocalCacheStore.memory.guild.set(ctx.guild!, {
                    ...oldCache!,
                    GuildLanguage: undefined,
                });
            await GuildsMongoModel.updateOne({ GuildId: ctx.guildId }, { $set: { GuildLanguage: "en-US" } });
            return await ctx.reply({
                content: await this.translate(ctx.channel as TextChannel, "commands/config:language_command.reset_success", {
                    language: client.environment.bot.bot_language,
                }),
            });
        } else {
            let findLang = langsWeCanUse.find(lang => lang.code === newLang)
            if (!findLang) {
                return await ctx.reply({
                    content: await this.translate(
                        ctx.channel as TextChannel,
                        "commands/config:language_command.invalid_language",
                        {
                            language: newLang,
                        }
                    ),
                    embeds: [
                        new BaseEmbed().contextEmbed({
                            fields: [
                                {
                                    name: "supported_languages",
                                    value: langsWeCanUse.map(lang => `\`Name:${lang.name} Code: (${lang.code})\``).join("\n"),
                                }
                            ]
                        }, ctx)
                    ]
                });
            }
            // Setting the language in the cache
            let oldCache = client.LocalCacheStore.memory.guild.get(ctx.guild!);
                client.LocalCacheStore.memory.guild.set(ctx.guild!, {
                    ...oldCache!,
                    GuildLanguage: newLang,
                });
            await GuildsMongoModel.updateOne({ GuildId: ctx.guildId }, { $set: { GuildLanguage: newLang } });
            return await ctx.reply({
                content: await this.translate(ctx.channel as TextChannel, "commands/config:language_command.success", {
                    language: newLang,
                }),
            });
        }
    }
}
