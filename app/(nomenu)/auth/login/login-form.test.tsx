// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { LoginForm } from "./login-form";

vi.mock("./actions/auth", () => ({ signInWithMagicLink: vi.fn() }));

describe("LoginForm", () => {
  afterEach(cleanup);

  it("explains that the link has expired", () => {
    render(<LoginForm membershipExpired={false} linkExpired={true}/>);
    expect(screen.getByText(/Ce lien a expiré ou a déjà été utilisé/)).toBeDefined();
  });

  it("shows no alert by default", () => {
    render(<LoginForm membershipExpired={false} linkExpired={false}/>);
    expect(screen.queryByText(/expiré/)).toBeNull();
  });
});
