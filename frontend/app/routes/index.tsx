/**
    Statistics Hub OSS - A data analytics discord bot.
    
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

import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { environment } from "~/config.server";

export const loader: LoaderFunction = async () => {
  return json(IndexPropsValue);
};

export default function Index() {
  const data = useLoaderData<IndexProps>();
  const date = new Date();
  return (
    <div>
      <h1>{environment.website_root_title} Landing Page</h1>
      <p>
        This is the test landing page for the bot, it is not intended to be used
        in production. Feel free to roam around the site and view the mock data.
      </p>

      <p>
        This site was created to help me play around with{" "}
        <a target="_blank" href="https://github.com/remix-run/remix">
          react remix
        </a>{" "}
        and see if I want to use it in the further development of the bot.
      </p>

      <hr />
      {data.map((i) => (
        <div key={i.id}>
          <h2>{i.name}</h2>
          <p>{i.description}</p>
          <a href={i.url} target="_blank">
            Link
          </a>
        </div>
      ))}
      <hr />
      <h2>Routing test:</h2>
      <ul>
        <li>
          <Link to={`/user/1`}>mock user page</Link>
        </li>
      </ul>
      <footer>
        <p>This page was rendered at {date.toLocaleDateString()}</p>
      </footer>
    </div>
  );
}

interface IndexProps {
  map(consume: (value: IndexProps) => JSX.Element): import("react").ReactNode;
  id: string;
  name: string;
  description: string;
  url: string;
}

const IndexPropsValue = [
  {
    id: "1",
    name: "Github",
    description: "The site source code",
    url: "https://github.com/ThatGuyJamal/statistics-hub-oss/tree/master/frontend",
  },
  {
    id: "2",
    name: "Discord Server",
    description: "The bot support server",
    url: "https://discord.com/invite/N79DZsm3m2",
  },
] as IndexProps[];
