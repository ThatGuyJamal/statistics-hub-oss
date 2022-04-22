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

import { FC } from "react";
import { Guild } from "../../utils/types";
import styles from "./index.module.scss";
import Image from "next/image";

type Props = {
  guild: Guild;
};

export const GuildMenuItem: FC<Props> = ({ guild }) => {
  return (
    <div className={styles.container}>
      <Image
        src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
        height={55}
        width={55}
        className={styles.image}
        alt={guild.name}
      />
      <p>{guild.name}</p>
    </div>
  );
};
