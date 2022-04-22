import { NextPage, GetServerSidePropsContext } from "next";
import Link from "next/link";
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

      <h2>
        <Link href="/">Home</Link>
      </h2>
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
          icon: "064038d71473bb5f142a6b85a324a930",
        }
      ],
    },
  };
}

export default MenuPage;
