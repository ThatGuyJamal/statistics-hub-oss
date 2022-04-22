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

import { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { GuildProps, MockGuildData } from "~/database/mock.server";

export const loader: LoaderFunction = async ({ params }) => {
  const id = params.id;

  console.log(`Loading user ${id}`);

  return {
    id,
  };
};

export default function User() {
  const props = useLoaderData<UserProps>();

  return (
    <div>
      <h1>Mock User Page</h1>
      <h2>User Id: {props.id}</h2>
      Available Guilds (click to navigate):
      <ul>
        {MockGuildData.map((guild) => (
          <li key={guild.id}>
            <Link to={`/user/${props.id}/guild/${guild.id}`}>
              Go to {guild.name}
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/">Home</Link>
    </div>
  );
}

interface UserProps {
  map(consume: (value: UserProps) => JSX.Element): import("react").ReactNode;
  id: string;
  guilds: GuildProps[];
}
