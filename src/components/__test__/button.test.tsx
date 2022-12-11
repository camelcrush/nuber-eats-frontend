import { render } from "@testing-library/react";
import React from "react";
import { Button } from "../button";

describe("<Button />", () => {
  it("should render OK with props", () => {
    const { getByText, rerender } = render(
      <Button canClick={true} loading={false} actionText="test" />
    );
    getByText("test");
    // rerender 사용법
    // rerender(<Button canClick={true} loading={true} actionText="test" />);
    // getByText("Loading...");
  });

  it("should display loading", () => {
    const { getByText, container } = render(
      <Button canClick={false} loading={true} actionText="test" />
    );
    getByText("Loading...");
    // container를 통해 html에 접근, 해당 클래스를 가지고 있는지 테스트
    expect(container.firstChild).toHaveClass("pointer-events-none");
  });
});
