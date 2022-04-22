import "../styles/globals.scss";
import { useState } from "react";
import { AppPropsWithLayout, Guild } from "../utils/types";
import { GuildContext } from "../utils/context/GuildContext";

function MyApp({ Component, pageProps }: AppPropsWithLayout<any>) {
  const [guild, setGuild] = useState<Guild>();
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <GuildContext.Provider value={{ guild, setGuild }}>
      {getLayout(<Component {...pageProps} />)}
    </GuildContext.Provider>
  );
}

export default MyApp;
