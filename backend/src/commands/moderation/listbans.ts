import { ApplyOptions } from "@sapphire/decorators";
import { BucketScope } from "@sapphire/framework";
import { Message } from "discord.js";
import { ICommandOptions, ICommand } from "../../Command";
import stripIndent from "../../internal/functions/formatting";
import { seconds } from "../../internal/functions/time";
import { BaseEmbed } from "../../internal/structures/Embed";

@ApplyOptions<ICommandOptions>({
    aliases: ["lb"],
    description: "Shows the banned users in your server.",
    cooldownDelay: seconds(10),
    cooldownScope: BucketScope.User,
    cooldownLimit: 2,
    runIn: "GUILD_TEXT",
    nsfw: false,
    enabled: true,
    extendedDescription: {
        usage: "listbans",
        command_type: "message",
    },
    requiredUserPermissions: ["BAN_MEMBERS"],
    requiredClientPermissions: ["VIEW_AUDIT_LOG"]
})
export class UserCommand extends ICommand {
    public async messageRun(ctx: Message) { 
        const fetchBans = await ctx.guild?.bans.fetch()
        let amount = 1

        if (!fetchBans) {
            return await ctx.reply({
                content: `There are no banned users in this server.`,
            })
        }

        const bannedMembers = (await fetchBans)
            .map(
                (data) =>
                    `> __${amount++}.__ **${data.user.tag}** | (*${data.user.id}*) | Reason: *${data.reason ?? "No reason provided."}*`
            )
            .join("\n\n")

        if (amount === 0) {
            return await ctx.reply({
                content: `There are no banned users in this server.`,
            })
        }

        // check if we have over 40 bans in the server
        if (amount > 40) {
            return await ctx.reply({
                content: `There are too many banned users in this server to show right now. We are working on a fix.\n Amount: \`${bannedMembers.length}\``,
            })
        }

        return await ctx.reply({
            embeds: [
                new BaseEmbed().contextEmbed({
                    title: `Banned Users in ${ctx.guild?.name} | ${amount - 1}`,
                    description: stripIndent(`
                    === Banned Users ===
                    ${bannedMembers}
                    `)
                }, ctx),
            ]
        })
    }
    // public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) { }
    // public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    //     registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
    //         guildIds: getTestGuilds(),
    //         registerCommandIfMissing: environment.bot.register_commands,
    //         behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
    //         idHints: [],
    //     });
    // }
}