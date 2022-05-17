import { EventEmitter } from "events";
/**
 * Custom event handler for the plugins.
 */
export const CustomEventEmitter = new EventEmitter();

export enum customPluginEvents {
  PING_TO_JOIN = "pingToJoin",
  WELCOME_PLUGIN_JOIN = "welcomePluginJoin",
  WELCOME_PLUGIN_LEAVE = "welcomePluginLeave",
}
