import type { NextPage } from "next";
import Head from "next/head";
import { common } from "../utils/common";
import styles from "../styles/Home.module.scss";
import { FaDiscord } from "react-icons/fa";

const Home: NextPage = () => {
  const handleLogin = () => {
    // window.location.href = "http://localhost:3001/api/auth/discord";

    window.location.href = "/menu";

    alert("Website under construction...redirecting to menu");
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
        </div>
      </div>
      <div></div>
    </>
  );
};

export default Home;
