import type { MetaFunction } from "@remix-run/node";
import {environment} from "./config"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { initializeTypeGooseConnection } from "./database";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: environment.website_root_title,
  viewport: "width=device-width,initial-scale=1",
});

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
