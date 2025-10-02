import { NextRequest } from "next/server";
import { initializeApp, getApps } from "firebase/app";
import { getStorage, ref, listAll, getMetadata } from "firebase/storage";
import { firebaseConfig } from "@/firebase/config";

// Initialize Firebase if not already initialized
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const storage = getStorage();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const spaceId = searchParams.get("spaceId");
    const userId = searchParams.get("userId");

    if (!spaceId || !userId) {
      return new Response("Missing required parameters", { status: 400 });
    }

    // Create storage reference to the user's folder in the space
    const storageRef = ref(storage, `spaces/${spaceId}/${userId}`);
    
    // List all files
    const result = await listAll(storageRef);
    
    // Get metadata for each file
    const files = await Promise.all(
      result.items.map(async (item) => {
        const metadata = await getMetadata(item);
        return {
          name: item.name,
          size: metadata.size,
          contentType: metadata.contentType,
          timeCreated: metadata.timeCreated,
          updated: metadata.updated,
        };
      })
    );

    return Response.json({
      success: true,
      files,
    });
  } catch (error) {
    console.error("List files error:", error);
    return new Response("Failed to list files", { status: 500 });
  }
}
