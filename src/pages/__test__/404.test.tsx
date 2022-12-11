import { render, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import { NotFound } from "../404";
import { HelmetProvider } from "react-helmet-async";

describe("<NotFound />", () => {
  it("renders Ok", async () => {
    render(
      <HelmetProvider>
        <Router>
          <NotFound />
        </Router>
      </HelmetProvider>
    );
    // helmet-async로 인해 waitFor를 써 줘야 함
    await waitFor(() => {
      expect(document.title).toBe("Not Found | Nuber Eats");
    });
  });
});
