import React from "react";
import { render } from "@testing-library/react-native";
import { HomeScreen } from "./HomeScreen";

describe("HomeScreen", () => {
  it("renders the Home Screen text", () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText("Home Screen")).toBeTruthy();
  });
});
