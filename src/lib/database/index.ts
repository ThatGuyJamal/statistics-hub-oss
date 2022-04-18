import { container } from "@sapphire/framework";
import { connect, connection } from "mongoose";
import { ENV } from "../../config";

export async function initializeTypeGooseConnection() {
  try {
    await connect(ENV.database.mongodb_url);
  } catch (err) {
    container.logger.error(err);
  }
}

connection.on("error", (err) => {
  container.logger.error(err);
});

connection.on("disconnected", () => {
  container.logger.error(`Mongoose connection disconnected!`);
});

connection.on("disconnecting", () => {
  container.logger.info(`Mongoose is disconnecting...`);
});

connection.on("connecting", () => {
  container.logger.info(`Mongoose connection loading...`);
});

connection.on("connected", () => {
  container.logger.info(`Mongoose has connected!`);
});

connection.on("close", () => {
  container.logger.info(`Mongoose connection closed!`);
});
