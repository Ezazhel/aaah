// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { GamesFilterSheet } from "./games-filter-sheet";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

const categories = [{ id: 1, name: "Enfants", color: "#2b8fd6" }, { id: 2, name: "Familial", color: "#3f9a4f" }];
const mechanics = [{ id: 10, name: "Pose d’Ouvriers" }, { id: 11, name: "Draft" }];

const open = () => fireEvent.click(screen.getByRole("button", { name: /Filtres/ }));

describe("GamesFilterSheet", () => {
    beforeEach(() => push.mockClear());
    afterEach(cleanup);

    it("applies the selected filters to the URL and closes", () => {
        render(<GamesFilterSheet categories={categories} mechanics={mechanics} filters={{ categories: [], mechanics: [] }}/>);
        open();
        fireEvent.click(screen.getByRole("checkbox", { name: /Familial/ }));
        fireEvent.click(screen.getByRole("checkbox", { name: /Draft/ }));
        fireEvent.change(screen.getByLabelText("Nombre de joueurs"), { target: { value: "4" } });
        // Nothing is applied before the click.
        expect(push).not.toHaveBeenCalled();
        fireEvent.click(screen.getByRole("button", { name: "Appliquer" }));

        expect(push).toHaveBeenCalledWith("/games?category=2&mechanic=11&players=4", { scroll: false });
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    it("shows the active filters count and resets to the plain list", () => {
        render(<GamesFilterSheet categories={categories} mechanics={mechanics} filters={{ categories: [1], mechanics: [10], age: 8 }}/>);
        expect(screen.getByRole("button", { name: /Filtres/ }).textContent).toContain("3");
        open();
        fireEvent.click(screen.getByRole("button", { name: "Réinitialiser" }));
        fireEvent.click(screen.getByRole("button", { name: "Appliquer" }));

        expect(push).toHaveBeenCalledWith("/games", { scroll: false });
    });

    it("searches mechanics without accents", () => {
        render(<GamesFilterSheet categories={categories} mechanics={mechanics} filters={{ categories: [], mechanics: [] }}/>);
        open();
        fireEvent.change(screen.getByLabelText("Rechercher une mécanique"), { target: { value: "pose d'ouvriers" } });

        expect(screen.queryByRole("checkbox", { name: /Draft/ })).toBeNull();
        expect(screen.getByRole("checkbox", { name: /Pose/ })).toBeDefined();
    });
});
