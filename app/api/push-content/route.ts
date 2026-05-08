import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

const pathsToRefresh = [
  "/",
  "/blog",
  "/github",
  "/connect",
  "/contact"
];

export async function POST() {
  revalidateTag("obsidian-vault");

  for (const path of pathsToRefresh) {
    revalidatePath(path);
  }

  return NextResponse.json({
    ok: true,
    refreshedAt: new Date().toISOString()
  });
}
