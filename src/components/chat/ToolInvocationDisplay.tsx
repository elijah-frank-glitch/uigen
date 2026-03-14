"use client";

import { Loader2, FilePlus, FileEdit, FileSearch, FileMinus, FolderEdit } from "lucide-react";

interface ToolInvocationDisplayProps {
  toolName: string;
  state: string;
  args: Record<string, unknown>;
  result?: unknown;
}

function getToolLabel(toolName: string, args: Record<string, unknown>): { label: string; icon: React.ReactNode } {
  const path = (args.path as string) || "";
  const fileName = path.split("/").pop() || path;

  if (toolName === "str_replace_editor") {
    const command = args.command as string;
    switch (command) {
      case "create":
        return { label: `Created ${fileName}`, icon: <FilePlus className="w-3.5 h-3.5 text-emerald-600" /> };
      case "str_replace":
        return { label: `Edited ${fileName}`, icon: <FileEdit className="w-3.5 h-3.5 text-blue-600" /> };
      case "insert":
        return { label: `Edited ${fileName}`, icon: <FileEdit className="w-3.5 h-3.5 text-blue-600" /> };
      case "view":
        return { label: `Viewed ${fileName}`, icon: <FileSearch className="w-3.5 h-3.5 text-neutral-500" /> };
      default:
        return { label: `Modified ${fileName}`, icon: <FileEdit className="w-3.5 h-3.5 text-blue-600" /> };
    }
  }

  if (toolName === "file_manager") {
    const command = args.command as string;
    const newPath = args.new_path as string | undefined;
    if (command === "delete") {
      return { label: `Deleted ${fileName}`, icon: <FileMinus className="w-3.5 h-3.5 text-red-500" /> };
    }
    if (command === "rename" && newPath) {
      const newName = newPath.split("/").pop() || newPath;
      return { label: `Renamed ${fileName} → ${newName}`, icon: <FolderEdit className="w-3.5 h-3.5 text-amber-600" /> };
    }
  }

  return { label: toolName, icon: <FileEdit className="w-3.5 h-3.5 text-neutral-500" /> };
}

function getLoadingLabel(toolName: string, args: Record<string, unknown>): { label: string; icon: React.ReactNode } {
  const path = (args.path as string) || "";
  const fileName = path.split("/").pop() || path;

  if (toolName === "str_replace_editor") {
    const command = args.command as string;
    switch (command) {
      case "create":
        return { label: `Creating ${fileName}...`, icon: <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" /> };
      case "str_replace":
      case "insert":
        return { label: `Editing ${fileName}...`, icon: <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" /> };
      case "view":
        return { label: `Reading ${fileName}...`, icon: <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-500" /> };
      default:
        return { label: `Modifying ${fileName}...`, icon: <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" /> };
    }
  }

  if (toolName === "file_manager") {
    const command = args.command as string;
    if (command === "delete") {
      return { label: `Deleting ${fileName}...`, icon: <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" /> };
    }
    if (command === "rename") {
      return { label: `Renaming ${fileName}...`, icon: <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" /> };
    }
  }

  return { label: `Running ${toolName}...`, icon: <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-500" /> };
}

export function ToolInvocationDisplay({ toolName, state, args }: ToolInvocationDisplayProps) {
  const isComplete = state === "result";
  const { label, icon } = isComplete
    ? getToolLabel(toolName, args)
    : getLoadingLabel(toolName, args);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {icon}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
