import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

describe("primitives", () => {
  describe("Button", () => {
    it("renders its label and handles clicks", async () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Save</Button>);

      const button = screen.getByRole("button", { name: "Save" });
      await userEvent.click(button);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("applies the requested variant class", () => {
      render(<Button variant="destructive">Delete</Button>);
      expect(screen.getByRole("button", { name: "Delete" })).toHaveClass(
        "text-destructive",
      );
    });

    it("is disabled when the disabled prop is set", async () => {
      const onClick = vi.fn();
      render(
        <Button disabled onClick={onClick}>
          Nope
        </Button>,
      );

      const button = screen.getByRole("button", { name: "Nope" });
      expect(button).toBeDisabled();

      await userEvent.click(button);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe("Input", () => {
    it("reflects typed text", async () => {
      render(<Input aria-label="Email" />);
      const input = screen.getByLabelText("Email");

      await userEvent.type(input, "user@example.com");

      expect(input).toHaveValue("user@example.com");
    });

    it("respects the placeholder", () => {
      render(<Input placeholder="Search" />);
      expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
    });
  });

  describe("Label + Checkbox", () => {
    it("associates label with the checkbox and toggles it", async () => {
      render(
        <>
          <Checkbox id="terms" />
          <Label htmlFor="terms">Accept terms</Label>
        </>,
      );

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();

      await userEvent.click(screen.getByText("Accept terms"));
      expect(checkbox).toBeChecked();
    });
  });

  describe("Switch", () => {
    it("toggles state on click", async () => {
      render(<Switch aria-label="Notifications" />);
      const switchEl = screen.getByRole("switch");

      expect(switchEl).toHaveAttribute("aria-checked", "false");

      await userEvent.click(switchEl);
      expect(switchEl).toHaveAttribute("aria-checked", "true");
    });
  });
});
