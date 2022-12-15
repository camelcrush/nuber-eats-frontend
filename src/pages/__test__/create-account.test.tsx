import { ApolloProvider } from "@apollo/client";
import userEvent from "@testing-library/user-event";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import React from "react";
import { act } from "react-dom/test-utils";
import { render, waitFor, RenderResult } from "../../test-utils";
import { UserRole } from "../../__generated__/graphql";
import { CreateAccount, CREATE_ACCOUNT_MUTATION } from "../create-account";

describe("<CreateAccount />", () => {
  let mockClient: MockApolloClient;
  let renderResult: RenderResult;
  beforeEach(async () => {
    await waitFor(() => {
      mockClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockClient}>
          <CreateAccount />
        </ApolloProvider>
      );
    });
  });
  it("renders OK", async () => {
    await waitFor(() =>
      expect(document.title).toBe("Create Account | Nuber Eats")
    );
  });

  it("renders validation errors", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const button = getByRole("button");
    let errorMessage;
    userEvent.type(email, "error@wont");
    await waitFor(() => {
      errorMessage = getByRole("alert");
      expect(errorMessage).toHaveTextContent(/Please enter a valid email/i);
    });
    userEvent.clear(email);
    await waitFor(() => {
      errorMessage = getByRole("alert");
      expect(errorMessage).toHaveTextContent(/Email is required/i);
    });
    userEvent.type(email, "test@test.com");
    userEvent.click(button);
    await waitFor(() => {
      errorMessage = getByRole("alert");
      expect(errorMessage).toHaveTextContent(/Password is required/i);
    });
  });

  it("submits mutation with form values", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const button = getByRole("button");
    const formData = {
      email: "test@test.com",
      password: "123",
      role: UserRole.Client,
    };
    const mockedCreateAccountMutationResponse = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: true,
          error: "mutation-error",
        },
      },
    });
    // window.alert 기능 spyOn하여 대신 Implementation
    jest.spyOn(window, "alert").mockImplementation(() => null);
    mockClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockedCreateAccountMutationResponse
    );
    await act(async () => {
      await userEvent.type(email, formData.email);
      await userEvent.type(password, formData.password);
      await userEvent.click(button);
    });
    await waitFor(() => {
      expect(mockedCreateAccountMutationResponse).toHaveBeenCalledTimes(1);
      expect(mockedCreateAccountMutationResponse).toHaveBeenCalledWith({
        createAccountInput: {
          ...formData,
        },
      });
      let mutationError = getByRole("alert");
      expect(mutationError).toHaveTextContent("mutation-error");
    });
  });
});
