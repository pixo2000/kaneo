import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vite-plus/test";
import TaskParentIndicator from "./task-parent-indicator";
import { TooltipProvider } from "@/components/ui/tooltip";
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (_key: string, { title }: { title: string }) => `Sub-task of ${title}`,
  }),
}));
afterEach(cleanup);

it("shows all parent titles on hover and does not open or drag the task", async () => {
  const click = vi.fn();
  const pointerDown = vi.fn();
  render(
    <TooltipProvider delay={0}>
      <div onClick={click} onPointerDown={pointerDown} role="presentation">
        <TaskParentIndicator
          parents={[
            { id: "a", title: "Parent A" },
            { id: "b", title: "Parent B" },
          ]}
        />
      </div>
    </TooltipProvider>,
  );
  const trigger = screen.getByRole("button", {
    name: "Sub-task of Parent A; Sub-task of Parent B",
  });
  fireEvent.mouseEnter(trigger);
  expect(await screen.findByText("Sub-task of Parent A")).toBeInTheDocument();
  expect(screen.getByText("Sub-task of Parent B")).toBeInTheDocument();
  fireEvent.pointerDown(trigger);
  fireEvent.click(trigger);
  expect(click).not.toHaveBeenCalled();
  expect(pointerDown).not.toHaveBeenCalled();
});

it("does not show an indicator for tasks without accessible parents", () => {
  const { container } = render(<TaskParentIndicator parents={[]} />);
  expect(container).toBeEmptyDOMElement();
});
