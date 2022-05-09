import { container } from "@sapphire/framework";
import mongo from "mongoose";
import { environment } from "../config";

export async function ConnectToMongoose(str: string) {
  if(environment.db.mongo.enabled) {
    await mongo.connect(str, {
      autoCreate: true,
    }).then(() => container.logger.info("Connected to MongoDB!"));
  } else {
    container.logger.warn("MongoDB is not enabled! Skipping connection...");
  }
}
