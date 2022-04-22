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

import { NextPage, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { GuildMenuItem } from "../../components/guilds/GuildMenuItem";
import { Guild } from "../../utils/types";
import styles from "./index.module.scss";

type Props = {
  guilds: Guild[];
};

const MenuPage: NextPage<Props> = ({ guilds }) => {
  const router = useRouter();
  return (
    <div className="page">
      <div className={styles.container}>
        <h1 className={styles.title}>Please Select a Guild</h1>
        {guilds.map((guild) => (
          <div
            key={guild.id}
            onClick={() => router.push(`https://discord.com/invite/N79DZsm3m2`)}
            //   onClick={() => router.push(`/dashboard/${guild.id}`)}
          >
            <GuildMenuItem guild={guild} />
          </div>
        ))}
      </div>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // return fetchMutualGuilds(context);
  return {
    props: {
      guilds: [
        {
          id: "837830514130812970",
          name: "Statistics Hub OSS - Community & Support",
          icon: "2dc9595c86f1a007a269cc425e295025",
        }
      ],
    },
  };
}

export default MenuPage;
