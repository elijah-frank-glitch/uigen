import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationDisplay } from "../ToolInvocationDisplay";

afterEach(() => {
  cleanup();
});

// str_replace_editor — completed states

test("shows 'Created' label for str_replace_editor create command", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      state="result"
      args={{ command: "create", path: "/components/Button.jsx" }}
    />
  );

  expect(screen.getByText("Created Button.jsx")).toBeDefined();
});

test("shows 'Edited' label for str_replace_editor str_replace command", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      state="result"
      args={{ command: "str_replace", path: "/App.jsx" }}
    />
  );

  expect(screen.getByText("Edited App.jsx")).toBeDefined();
});

test("shows 'Edited' label for str_replace_editor insert command", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      state="result"
      args={{ command: "insert", path: "/utils/helpers.js" }}
    />
  );

  expect(screen.getByText("Edited helpers.js")).toBeDefined();
});

test("shows 'Viewed' label for str_replace_editor view command", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      state="result"
      args={{ command: "view", path: "/App.jsx" }}
    />
  );

  expect(screen.getByText("Viewed App.jsx")).toBeDefined();
});

test("shows 'Modified' label for unknown str_replace_editor command", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      state="result"
      args={{ command: "undo_edit", path: "/App.jsx" }}
    />
  );

  expect(screen.getByText("Modified App.jsx")).toBeDefined();
});

// file_manager — completed states

test("shows 'Deleted' label for file_manager delete command", () => {
  render(
    <ToolInvocationDisplay
      toolName="file_manager"
      state="result"
      args={{ command: "delete", path: "/old-file.jsx" }}
    />
  );

  expect(screen.getByText("Deleted old-file.jsx")).toBeDefined();
});

test("shows 'Renamed' label for file_manager rename command", () => {
  render(
    <ToolInvocationDisplay
      toolName="file_manager"
      state="result"
      args={{ command: "rename", path: "/old.jsx", new_path: "/new.jsx" }}
    />
  );

  expect(screen.getByText("Renamed old.jsx → new.jsx")).toBeDefined();
});

// Loading states

test("shows 'Creating' label when str_replace_editor create is in progress", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      state="call"
      args={{ command: "create", path: "/components/Card.jsx" }}
    />
  );

  expect(screen.getByText("Creating Card.jsx...")).toBeDefined();
});

test("shows 'Editing' label when str_replace_editor str_replace is in progress", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      state="call"
      args={{ command: "str_replace", path: "/App.jsx" }}
    />
  );

  expect(screen.getByText("Editing App.jsx...")).toBeDefined();
});

test("shows 'Reading' label when str_replace_editor view is in progress", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      state="call"
      args={{ command: "view", path: "/App.jsx" }}
    />
  );

  expect(screen.getByText("Reading App.jsx...")).toBeDefined();
});

test("shows 'Deleting' label when file_manager delete is in progress", () => {
  render(
    <ToolInvocationDisplay
      toolName="file_manager"
      state="call"
      args={{ command: "delete", path: "/old-file.jsx" }}
    />
  );

  expect(screen.getByText("Deleting old-file.jsx...")).toBeDefined();
});

test("shows 'Renaming' label when file_manager rename is in progress", () => {
  render(
    <ToolInvocationDisplay
      toolName="file_manager"
      state="call"
      args={{ command: "rename", path: "/old.jsx", new_path: "/new.jsx" }}
    />
  );

  expect(screen.getByText("Renaming old.jsx...")).toBeDefined();
});

// Edge cases

test("handles empty path gracefully", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      state="result"
      args={{ command: "create", path: "" }}
    />
  );

  expect(screen.getByText("Created")).toBeDefined();
});

test("falls back to tool name for unknown tools", () => {
  render(
    <ToolInvocationDisplay
      toolName="unknown_tool"
      state="result"
      args={{}}
    />
  );

  expect(screen.getByText("unknown_tool")).toBeDefined();
});

test("shows running label for unknown tool in loading state", () => {
  render(
    <ToolInvocationDisplay
      toolName="unknown_tool"
      state="call"
      args={{}}
    />
  );

  expect(screen.getByText("Running unknown_tool...")).toBeDefined();
});
