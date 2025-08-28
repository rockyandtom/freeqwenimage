import { type Metadata } from "next";
import WorkspaceLayout from "@/components/workspace/workspace-layout";

export const metadata: Metadata = {
  title: "AI Tools Workspace - FreeQwenImage",
  description: "Unified AI tools workspace for image and video generation, editing, and enhancement. Professional AI tools with multiple provider options.",
  keywords: ["AI workspace", "AI tools", "image generation", "video creation", "AI art", "image enhancement"],
};

export default function AIToolsPage() {
  return <WorkspaceLayout />;
}