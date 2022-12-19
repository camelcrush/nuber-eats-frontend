describe("Create Account", () => {
  const user = cy;
  it("should see email / password validation errors", () => {
    user.visit("/");
    user.findByText(/create an account/i).click();
    user.findByPlaceholderText(/email/i).type("not@work");
    user.findByRole("alert").should("have.text", "Please enter a valid email");
    user.findByPlaceholderText(/email/i).clear();
    user.findByRole("alert").should("have.text", "Email is required");
    user.findByPlaceholderText(/email/i).type("test1@test.com");
    user
      .findByPlaceholderText(/password/i)
      .type("a")
      .clear();
    user.findByRole("alert").should("have.text", "Password is required");
  });

  it("should be able to create account and login", () => {
    // req 인터셉트하여 res 반환하기
    user.intercept("http://localhost:4000/graphql", (req) => {
      const { operationName } = req.body;
      // operationName이 createAccount일 때만 인터셉트하기로 설정
      if (operationName && operationName === "createAccount") {
        req.reply((res) => {
          res.send({
            data: {
              createAccount: {
                ok: true,
                error: null,
                __typename: "CreateAccountOutput",
              },
            },
          });
        });
      }
    });
    user.visit("/create-account");
    user.findByPlaceholderText(/email/i).type("test1@test.com");
    user.findByPlaceholderText(/password/i).type("123");
    user.findByRole("button").click();
    user.wait(1000);
    user.login("dkxm0927@customer.com", "123");
  });
});
