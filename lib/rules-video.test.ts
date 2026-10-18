import { describe, expect, it } from "vitest";
import { parseRulesVideo, rulesVideoEmbedUrl, rulesVideoThumbnail } from "./rules-video";

const youtube = { provider: "youtube", id: "dQw4w9WgXcQ" };
const vimeo = { provider: "vimeo", id: "76979871" };

describe("parseRulesVideo", () => {
  it.each([
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://youtube.com/watch?v=dQw4w9WgXcQ&t=42s",
    "https://m.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://youtu.be/dQw4w9WgXcQ?si=abc",
    "https://www.youtube.com/shorts/dQw4w9WgXcQ",
    "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    "  https://youtu.be/dQw4w9WgXcQ  ",
  ])("reads the YouTube link %s", (url) => {
    expect(parseRulesVideo(url)).toEqual(youtube);
  });

  it.each([
    "https://vimeo.com/76979871",
    "https://www.vimeo.com/76979871",
    "https://player.vimeo.com/video/76979871?h=abc",
  ])("reads the Vimeo link %s", (url) => {
    expect(parseRulesVideo(url)).toEqual(vimeo);
  });

  it.each([
    "",
    "pas un lien",
    "http://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://www.youtube.com/watch",
    "https://www.youtube.com/watch?v=trop-court",
    "https://www.youtube.com/@chaine",
    "https://vimeo.com/channels/staffpicks",
    "https://www.dailymotion.com/video/x7tgad0",
    "https://youtube.com.evil.example/watch?v=dQw4w9WgXcQ",
  ])("refuses %s", (url) => {
    expect(parseRulesVideo(url)).toBeNull();
  });
});

describe("player and thumbnail", () => {
  it("uses the no-cookie YouTube player", () => {
    expect(rulesVideoEmbedUrl({ provider: "youtube", id: "dQw4w9WgXcQ" })).toBe("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1");
    expect(rulesVideoThumbnail({ provider: "youtube", id: "dQw4w9WgXcQ" })).toBe("https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg");
  });

  it("asks Vimeo not to track, without thumbnail", () => {
    expect(rulesVideoEmbedUrl({ provider: "vimeo", id: "76979871" })).toBe("https://player.vimeo.com/video/76979871?dnt=1&autoplay=1");
    expect(rulesVideoThumbnail({ provider: "vimeo", id: "76979871" })).toBeNull();
  });
});
