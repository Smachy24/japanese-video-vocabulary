import { createFileRoute } from "@tanstack/react-router";
import { Player } from "../pages/Player";

export const Route = createFileRoute("/player/$videoId")({
  component: Player,
});
