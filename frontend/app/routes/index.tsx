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
import { environment } from "~/config";

export const loader: LoaderFunction = async () => {
  return json(IndexPropsValue)
};

export default function Index() {
  const data = useLoaderData<IndexProps>();
  return (
    <div >
      <h1>{environment.website_root_title} Landing Page</h1>

      This is the test landing page for the bot, it is not intended to be used in production.
      Feel free to roam around the site and view the mock data.
      
      {/* Create a line below the title */}
      <hr />

      {data.map((i) => (
        <div key={i.id}>
          <h2>{i.name}</h2>
          <p>{i.description}</p>
          <a href={i.url} target="_blank">Link</a>
        </div>
      ))}

      <hr />

      <ul>
        <li>
          <Link to={`/user/1`}>
            mock user page
          </Link>
        </li>
        <li>
          <Link to={`/user/1/guild/1`}>
            mock guild page
          </Link>
        </li>
      </ul>

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
    url: "https://github.com/ThatGuyJamal/statistics-hub-oss/tree/master/frontend"
  },
  {
    id: "2",
    name: "Discord Server",
    description: "The bot support server",
    url: "https://discord.com/invite/N79DZsm3m2"
  },
] as IndexProps[]
