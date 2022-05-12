/**
 *  Statistics Hub OSS - A data analytics discord bot.
    
    Copyright (C) 2022, ThatGuyJamal and contributors
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU Affero General Public License for more details.
 */

import { container } from "@sapphire/framework";
import mongo from "mongoose";
import { environment } from "../config";

export async function ConnectToMongoose(str: string) {
  if (environment.db.mongo.enabled) {
    await mongo
      .connect(str, {
        autoCreate: true,
      })
      .then(() => container.logger.info("Connected to MongoDB!"));
  } else {
    container.logger.warn("MongoDB is not enabled! Skipping connection...");
  }
}
