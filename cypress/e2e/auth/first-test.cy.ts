describe("First Test", () => {
  const user = cy;
  it("should go to homepage", () => {
    cy.visit("/").title().should("eq", "Login | Nuber Eats");
  });

  it("can see email / password validation errors", () => {
    user.visit("/");
    user.findByPlaceholderText(/email/i).type("bad@email");
    user.findByRole("alert").should("have.text", "Please enter a valid email");
    user.findByPlaceholderText(/email/i).clear();
    user.findByRole("alert").should("have.text", "Email is required");
    user.findByPlaceholderText(/email/i).type("ok@email.com");
    user
      .findByPlaceholderText(/password/i)
      .type("a")
      .clear();
    user.findByRole("alert").should("have.text", "Password is required");
  });

  it("can fill out the form", () => {
    user.visit("/");
    user.findByPlaceholderText(/email/i).type("dkxm0927@customer.com");
    user.findByPlaceholderText(/password/i).type("123");
    user
      .findByRole("button")
      .should("not.have.class", "pointer-events-none")
      .click();
    // window : 현재 활성화된 window 객체를 가져온다
    // its : 이전에 가져온 객체의 프로퍼티를 가져온다
    user.window().its("localStorage.nuber-token").should("be.a", "string");
  });
});
