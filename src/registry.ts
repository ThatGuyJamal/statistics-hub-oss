import "@sapphire/plugin-logger/register";
import "@sapphire/plugin-i18next/register";
import "@kaname-png/plugin-statcord/register";
import "@sapphire/plugin-hmr/register";
import { container } from "@sapphire/framework";
import { BotClient } from "./lib/client/bot";

async function bootstrap(): Promise<void> {
  await BotClient.startClient();
}

bootstrap()
  .then(() => {
    container.logger.info("Bootstrap complete! All services are online!");
  })
  .catch((err) => {
    container.logger.error(err);
  });

// process.on("unhandledRejection", (error) => {
//   container.logger.error("Unhandled promise rejection:", error);
// });

// process.on("rejectionHandled", (error) => {
//   container.logger.error("Promise rejection handled:", error);
// });

// process.on("uncaughtException", (error) => {
//   container.logger.error("Uncaught exception:", error);
// });

// process.on("exit", (code) => {
//   container.logger.info(`Exiting with code ${code}`);
// });
