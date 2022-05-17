import { EventEmitter } from "events";
/**
 * Custom event handler for the plugins.
 */
export const CustomEventEmitter = new EventEmitter();

import { pingOnJoinEvent } from "./pingonjoin"
import { welcomeJoinEvent, welcomeLeaveEvent } from "./welcome"

/**
 * Registers all the events for the plugins.
 */
export function runAllCustomEvents() {
  pingOnJoinEvent();
  welcomeJoinEvent();
  welcomeLeaveEvent();
}

export enum customPluginEvents {
  PING_TO_JOIN = "pingToJoin",
  WELCOME_PLUGIN_JOIN = "welcomePluginJoin",
  WELCOME_PLUGIN_LEAVE = "welcomePluginLeave",
}
