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
import { MockGuildData } from "~/database/mock.server";

export const loader: LoaderFunction = async ({ params }) => {
  const id = params.id;

  console.log(`Loading guild ${id}`);

  const data = MockGuildData.find((guild) => guild.id === id);

  if(!data) {
    return null
  }

  return {
    id,
    name: data?.name ?? "No Guild Name Found",
    description: data?.description ?? "No Guild Description Found",
  };
};

export default function Guild() {
  const props = useLoaderData<{
    id: string;
    name: string;
    description: string;
  }>();

  return (
    <div>
      <h1>Guild Page</h1>

      <h3>Guild Information</h3>
      <p>
        Guild Id: {props.id}
        <br />
        Guild Name: {props.name}
        <br />
        Guild Description: {props.description}
      </p>

      <Link to="/user/0">back</Link>
      <br />
      <Link to="/">Home</Link>
    </div>
  );
}
