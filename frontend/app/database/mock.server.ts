export const MockGuildData = [
  {
    id: "1",
    name: "Server 1",
    description: "The first server",
  },
  {
    id: "2",
    name: "Server 2",
    description: "The second server",
  },
] as GuildProps[];

export interface GuildProps {
  id: string;
  name: string;
  description: string;
}
