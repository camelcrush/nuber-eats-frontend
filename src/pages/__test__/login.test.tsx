import { ApolloProvider } from "@apollo/client";
import { createMockClient } from "mock-apollo-client";
import { render, RenderResult, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Login } from "../login";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";

describe("<Login />", () => {
  let renderResult: RenderResult;
  // Form이 state를 변화시키기 때문에 async await waitFor를 해주어야 함
  beforeEach(async () => {
    await waitFor(() => {
      // mockedClient를 통해 세부적인 테스트를 할 수 있음
      const mockedClient = createMockClient();
      renderResult = render(
        <HelmetProvider>
          <Router>
            <ApolloProvider client={mockedClient}>
              <Login />
            </ApolloProvider>
          </Router>
        </HelmetProvider>
      );
    });
  });
  it("should render OK", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Login | Nuber Eats");
    });
  });

  it("displays email validation errors", async () => {
    const { getByPlaceholderText, getByRole, debug } = renderResult;
    // RegEx /email/i에서 i: insensitive 대소문자 구분없이, 그냥 string ""을 써줘도 됨
    const email = getByPlaceholderText(/Email/);
    // 유저 이벤트 발생
    userEvent.type(email, "thisdd");
    let errorMessage;
    await waitFor(() => {
      // role설정을 통해 해당 엘리먼트를 불러올 수 있음
      errorMessage = getByRole("alert");
      expect(errorMessage).toHaveTextContent(/please enter a valid email/i);
    });
    userEvent.clear(email);
    await waitFor(() => {
      errorMessage = getByRole("alert");
      expect(errorMessage).toHaveTextContent(/email is required/i);
    });
  });
});
