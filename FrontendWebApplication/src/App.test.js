import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders home route", () => {
  render(<App />);
  const text = screen.getByText(/Submit Wikipedia Input/i);
  expect(text).toBeInTheDocument();
});
