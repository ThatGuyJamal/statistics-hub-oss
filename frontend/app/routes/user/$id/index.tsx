import { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

const MockGuildData = [
    {
        id: "1",
        name: "Server 1",
        description: "The first server",
    },
    {
        id: "2",
        name: "Server 2",
        description: "The second server",
    }
] as GuildProps[]

export const loader: LoaderFunction = async ({ params }) => {
  const id = params.id;
  const guildId = params.guildId;

  console.log(`Loading user ${id}`);

  return {
    id,
    guildId
  }
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

interface GuildProps {
  id: string;
  name: string;
  description: string;
}
