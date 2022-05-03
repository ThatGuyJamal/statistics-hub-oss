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

import type { NextPage } from "next";
import Head from "next/head";
import { common } from "../utils/common";
import styles from "../styles/Home.module.scss";
import { FaDiscord } from "react-icons/fa";

const Home: NextPage = () => {
  const handleLogin = () => {
    // window.location.href = "http://localhost:3001/api/auth/discord";

    // window.location.href = "/menu";

    alert("Website under construction...redirecting to home");
  };

  return (
    <>
      <Head>
        <title>{common.website_title}</title>
        <meta name="description" content={common.website_description} />
        <link rel="icon" href="/image2vector.svg" />
      </Head>
      <div className="page aligned-center">
        <div>
          <button className={styles.button} onClick={handleLogin}>
            <FaDiscord size={50} color="#7289DA" />
            <span>Login with Discord</span>
          </button>
          <br />
            <a>An open-source statistics bot for server analytics.<a>
          <br />
          <div className={styles.social_links}>
            <a target="_blank"  rel="noreferrer" href={common.website_discord_server}>Discord Server</a> |{" "}
            <a target="_blank"  rel="noreferrer" href={common.website_github_repo}>Github</a> |{" "}
            <a target="_blank"  rel="noreferrer" href={common.developer_youtube_channel}>YouTube</a>
          </div>
        </div>
      </div>
      <div></div>
    </>
  );
};

export default Home;
