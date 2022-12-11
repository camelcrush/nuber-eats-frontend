import { render, waitFor } from "@testing-library/react";
import React from "react";
import { isLoggedInVar } from "../../apollo";
import App from "../app";

jest.mock("../../routers/logged-out-router", () => {
  return {
    LoggedOutRouter: () => <span>logged-out</span>,
  };
});

jest.mock("../../routers/logged-in-router", () => {
  return {
    LoggedInRouter: () => <span>logged-in</span>,
  };
});

describe("<App />", () => {
  it("renders LoggedOutRouter", () => {
    const { getByText, debug } = render(<App />);
    getByText("logged-out");
    debug();
  });
  it("renders LoggedInRouter", async () => {
    const { getByText, debug } = render(<App />);
    await waitFor(() => {
      isLoggedInVar(true);
      getByText("logged-in");
    });
    debug();
  });
});
