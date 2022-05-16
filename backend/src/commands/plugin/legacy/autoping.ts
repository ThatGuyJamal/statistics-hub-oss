import { ApplyOptions } from "@sapphire/decorators";
import { Args, BucketScope } from "@sapphire/framework";
import { Message } from "discord.js";
import { ICommandOptions, ICommand } from "../../../Command";
import { seconds } from "../../../internal/functions/time";


@ApplyOptions<ICommandOptions>({
    name: "autoping",
    description: "Enables ping on user join.",
    cooldownDelay: seconds(10),
    cooldownScope: BucketScope.User,
    cooldownLimit: 1,
    runIn: "GUILD_TEXT",
    nsfw: false,
    enabled: true,
    extendedDescription: {
        usage: "autoping <channel>",
        examples: ["autoping #giveaway"],
        command_type: "message",
    },
    requiredUserPermissions: ["MANAGE_GUILD"],
})
export class UserCommand extends ICommand {
    public async messageRun(ctx: Message, args: Args) {
        const channelArgumentOne = await args.pick("channel").catch(() => null)
        const channelArgumentTwo = await args.pick("channel").catch(() => null)
        const channelArgumentThree = await args.pick("channel").catch(() => null)

        if(!channelArgumentOne || !channelArgumentTwo || !channelArgumentThree) {
            return ctx.reply({
                content: `Invalid channel(s) provided.`,
                embeds: [
                    {
                        title: "Syntax",
                        description: `autoping <channel> <channel> <channel>\n\n The last two channels are optional.`,
                    }
                ]
            })
        }

        return ctx.reply({
            content: `Coming soon...`
        })
     }
}