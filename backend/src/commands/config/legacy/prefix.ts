import { ApplyOptions } from "@sapphire/decorators";
import { Args, BucketScope } from "@sapphire/framework";
import { Message, TextChannel } from "discord.js";
import { ICommandOptions, ICommand } from "../../../Command";
import { GuildsMongoModel } from "../../../database/models/guild";
import { seconds } from "../../../internal/functions/time";

@ApplyOptions<ICommandOptions>({
    name: "prefix",
    aliases: ["setprefix", "sprefix"],
    description: "Sets the prefix for the bot.",
    cooldownDelay: seconds(10),
    cooldownScope: BucketScope.User,
    cooldownLimit: 2,
    runIn: "GUILD_TEXT",
    nsfw: false,
    enabled: true,
    extendedDescription: {
        usage: "prefix <new prefix>",
        examples: ["prefix ??"],
        command_type: "message",
    },
    requiredUserPermissions: ["ADMINISTRATOR"],
})
export class UserCommand extends ICommand {
    public async messageRun(ctx: Message, args: Args) {
        const { client } = this.container;
        const newPrefix = await args.pick("string").catch(() => null);

        if (!newPrefix) {
            let currentPrefix = client.LocalCacheStore.memory.guild.get(ctx.guild!)?.GuildPrefix
            return ctx.reply({
                content: await this.translate(ctx.channel as TextChannel, "commands/config:prefix_command.missing_args"),
                embeds: [
                    {
                        description: await this.translate(ctx.channel as TextChannel, "commands/config:prefix_command.current_prefix", {
                            prefix: currentPrefix ?? client.environment.bot.bot_prefix
                        })
                    }
                ]
            })
        } else {
            const guild = await GuildsMongoModel.findOne({ guildId: ctx.guild!.id });
    
            if (!guild) {
                await GuildsMongoModel.create({
                    GuildId: ctx.guild!.id,
                    GuildName: ctx.guild!.name,
                    GuildOwnerId: ctx.guild!.ownerId,
                    GuildPrefix: newPrefix,
                });
            } else {
                // Make sure the old values are not overwritten
                let oldCache = client.LocalCacheStore.memory.guild.get(ctx.guild!)
                console.log(oldCache)
                let newC = client.LocalCacheStore.memory.guild.set(ctx.guild!, {
                    ...oldCache!,
                    GuildPrefix: newPrefix,
                })
                console.log(newC)
                // Update the database
                await GuildsMongoModel.updateOne({ guildID: ctx.guild!.id }, { $set: { GuildPrefix: newPrefix } }).then((res) => client.logger.info(res))
            }
    
            return await ctx.reply({
                content: await this.translate(ctx.channel as TextChannel, "commands/config:prefix_command.new_prefix", {
                    prefix: newPrefix
                }),
                embeds: []
            })
        }

    }
}