import { describe, expect, it } from "vitest";
import { gameSchema } from "./schema";

const game = {
  name: "Mon jeu",
  description: "Un jeu.",
  age_threshold: 8,
  min_players: 2,
  max_players: 4,
  min_time_minutes: 15,
  max_time_minutes: 30,
  category_id: 1,
  mechanic_ids: [1],
};

const videoError = (rules_video_url: string) =>
  gameSchema.safeParse({ ...game, rules_video_url }).error?.issues.find(({ path }) => path[0] === "rules_video_url")?.message;

describe("gameSchema rules_video_url", () => {
  it("is optional", () => {
    expect(videoError("")).toBeUndefined();
    expect(videoError("   ")).toBeUndefined();
  });

  it("accepts YouTube and Vimeo links", () => {
    expect(videoError("https://youtu.be/dQw4w9WgXcQ")).toBeUndefined();
    expect(videoError("https://vimeo.com/76979871")).toBeUndefined();
  });

  it("refuses other links", () => {
    expect(videoError("https://www.dailymotion.com/video/x7tgad0")).toBe("Collez un lien YouTube ou Vimeo.");
  });
});
