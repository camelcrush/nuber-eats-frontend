import { ApolloProvider } from "@apollo/client";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { act, render, RenderResult, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Login, LOGIN_MUTATION } from "../login";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";

describe("<Login />", () => {
  let renderResult: RenderResult;
  let mockClient: MockApolloClient;
  // Form이 state를 변화시키기 때문에 async await waitFor를 해주어야 함
  beforeEach(async () => {
    await waitFor(async () => {
      // mockedClient를 통해 세부적인 테스트를 할 수 있음
      mockClient = createMockClient();
      renderResult = render(
        <HelmetProvider>
          <Router>
            <ApolloProvider client={mockClient}>
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
    const email = getByPlaceholderText(/email/i);
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

  it("display password required errors", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const submitBtn = getByRole("button");
    userEvent.type(email, "this@wont.com");
    userEvent.click(submitBtn);
    await waitFor(() => {
      const errorMessage = getByRole("alert");
      expect(errorMessage).toHaveTextContent(/password is required/i);
    });
  });

  it("submits form and calls mutation", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const submitBtn = getByRole("button");
    const formData = {
      email: "real@test.com",
      password: "123",
    };
    // Mutation Response를 직접 설정
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: true,
          token: "XXX",
          error: "mutation-error",
        },
      },
    });
    // handler를 통해 쿼리를 테스트 실행 후 Mutation Response를 받기, 그러나 에러로 안됨 포기..
    mockClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);
    jest.spyOn(Storage.prototype, "setItem");
    // 해답을 찾음...
    await act(async () => {
      await userEvent.type(email, formData.email);
      await userEvent.type(password, formData.password);
      await userEvent.click(submitBtn);
    });
    await waitFor(() => {
      const errorMessage = getByRole("alert");
      expect(errorMessage).toHaveTextContent(/mutation-error/i);
      expect(localStorage.setItem).toHaveBeenCalledWith("nuber-token", "XXX");
      expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
      expect(mockedMutationResponse).toHaveBeenCalledWith({
        loginInput: {
          email: formData.email,
          password: formData.password,
        },
      });
    });
  });
});
