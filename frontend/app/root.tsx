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

import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { environment } from "./config.server";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import stylesUrl from "./styles/global.css";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: environment.website_root_title,
  description: environment.website_root_description,
  viewport: "width=device-width,initial-scale=1",
});

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div>
      <h1>App Error: {error.name}</h1>
      <pre>Error - {error.message}</pre>
      <pre>
        {renderFullError()
          ? "Please contact the developers about this error, thanks."
          : error.stack}
      </pre>
    </div>
  );
}

const renderFullError = () => {
  if (environment.development_mode) return false;
  else return true;
};
