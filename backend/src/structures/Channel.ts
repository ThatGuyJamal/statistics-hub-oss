import { BotClientType } from "../Client";
import { Channel, CreateGuildChannel, CreateMessage, Guild, ModifyChannel } from "../deps";
import DestructObject from "./DestructObject";

export class ChannelStructure extends DestructObject {
  protected client: BotClientType;
  public _raw: Channel;
  public guild: Guild;

  public constructor(myClient: BotClientType, data: Channel, options: { id: bigint; name: string; guild: Guild }) {
    super();
    this.client = myClient;
    this._raw = data;
    this.guild = options.guild;

    if (options.guild) {
      this.guild = options.guild;
    }
  }
  public async create(options: CreateGuildChannel, reason?: string): Promise<Channel> {
    return this.client.helpers.createChannel(this.guild.id, options, reason);
  }
  public edit(options: ModifyChannel, reason?: string): Promise<Channel> {
    return this.client.helpers.editChannel(this.guild.id, options, reason);
  }
  public delete(reason?: string): Promise<void> {
    return this.client.helpers.deleteChannel(this.guild.id, reason);
  }
  public fetch(id: bigint): Promise<Channel> {
    return this.client.helpers.getChannel(this.guild.id);
  }

  public send(message: CreateMessage) {
    return this.client.helpers.sendMessage(this.guild.id, message);
  }
}
