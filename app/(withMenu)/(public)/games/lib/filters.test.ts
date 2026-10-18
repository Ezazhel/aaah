import { describe, expect, it } from "vitest";
import { countActiveFilters, parseGameFilters, toSearchParams } from "./filters";

const empty = { categories: [], mechanics: [], players: undefined, duration: undefined, age: undefined };

describe("parseGameFilters", () => {
    it("parses every filter", () => {
        expect(parseGameFilters({ category: "1,2", mechanic: ["3", "4"], players: "4", duration: "60", age: "8" }))
            .toEqual({ categories: [1, 2], mechanics: [3, 4], players: 4, duration: 60, age: 8 });
    });

    it("returns no filter without params", () => {
        expect(parseGameFilters({})).toEqual(empty);
    });

    it("drops invalid and duplicated values", () => {
        expect(parseGameFilters({ category: "abc,2,2,-1", mechanic: "1.5", players: "-1", duration: "0", age: "huit" }))
            .toEqual({ ...empty, categories: [2] });
    });
});

describe("toSearchParams", () => {
    it("omits empty filters", () => {
        expect(toSearchParams(empty).toString()).toBe("");
    });

    it("round-trips with parseGameFilters", () => {
        const filters = { categories: [1, 2], mechanics: [3], players: 4, duration: 60, age: 8 };
        const params = Object.fromEntries(toSearchParams(filters));
        expect(parseGameFilters(params)).toEqual(filters);
    });
});

describe("countActiveFilters", () => {
    it("counts each selected tag and each number", () => {
        expect(countActiveFilters({ categories: [1, 2], mechanics: [3], players: 4 })).toBe(4);
        expect(countActiveFilters(empty)).toBe(0);
    });
});
