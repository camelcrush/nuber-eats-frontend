import { render, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import { Header } from "../header";
import { ME_QUERY } from "../../hooks/useMe";

describe("<Header />", () => {
  it("renders verify banner", async () => {
    await waitFor(async () => {
      const { getByText } = render(
        // Test에서는 ApolloProvier 대신 MockedProvider를 써야 query, mutation 접근이 가능함
        <MockedProvider
          mocks={[
            {
              request: {
                query: ME_QUERY,
              },
              result: {
                data: {
                  me: {
                    id: 1,
                    email: "",
                    role: "",
                    verified: false,
                  },
                },
              },
            },
          ]}
        >
          <Router>
            <Header />
          </Router>
        </MockedProvider>
      );
      await new Promise((resolve) => setTimeout(resolve, 5));
      getByText("Please verify your email");
    });
  });

  it("renders without verify banner", async () => {
    await waitFor(async () => {
      const { queryByText } = render(
        <MockedProvider
          mocks={[
            {
              request: {
                query: ME_QUERY,
              },
              result: {
                data: {
                  me: {
                    id: 1,
                    email: "",
                    role: "",
                    verified: true,
                  },
                },
              },
            },
          ]}
        >
          <Router>
            <Header />
          </Router>
        </MockedProvider>
      );
      // Apollo Query, Mutation 등은 시간이 걸리기에 5초정도 기다려야 함
      await new Promise((resolve) => setTimeout(resolve, 5));
      // queryByText : 없으면 null값을 리턴함, getByText는 에러를 일으킴
      expect(queryByText("Please verify your email")).toBeNull();
    });
  });
});
