import { describe, expect, it, vi } from "vitest";
import { gameRulesDownloadUrl, gameRulesUrl } from "./game-rules";

vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://supabase.test");

const gameId = "6f1c2b9e-0000-4000-8000-000000000000";

describe("gameRulesUrl", () => {
  it("is null without PDF", () => {
    expect(gameRulesUrl(gameId, null)).toBeNull();
  });

  it("changes with each version", () => {
    expect(gameRulesUrl(gameId, "2026-10-13T08:00:00.000Z")).toBe(
      `https://supabase.test/storage/v1/object/public/game-rules/${gameId}/rules.pdf?v=${Date.parse("2026-10-13T08:00:00.000Z")}`,
    );
  });
});

describe("gameRulesDownloadUrl", () => {
  it("asks Storage for an attachment named after the game", () => {
    expect(gameRulesDownloadUrl("https://supabase.test/x.pdf?v=1", "mon-jeu")).toBe("https://supabase.test/x.pdf?v=1&download=regles-mon-jeu.pdf");
  });
});
