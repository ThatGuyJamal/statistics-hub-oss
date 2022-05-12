import { APIApplicationCommandOptionChoice } from "discord-api-types/v9";

// TODO replace this with this hardcoded list in the command file
export const welcomeUpdateChoices: APIApplicationCommandOptionChoice<string>[] = [
  {
    name: "Sunset forest Banner",
    value: "https://i.imgur.com/ea9PB3H.png",
  },
  {
    name: "Green Railroad",
    value: "https://i.imgur.com/dCS4tQk.jpeg",
  },
  {
    name: "Rain Drops",
    value: "https://i.imgur.com/ftY0903.jpeg",
  },
  {
    name: "Hidden Lighthouse",
    value: "https://cdn.discordapp.com/attachments/937124004492365874/968196852056997938/EpicBanner.png",
  },
  {
    name: "Warm sunset",
    value: "https://cdn.discordapp.com/attachments/937124004492365874/972560334965579886/Banner2.png",
  },
];