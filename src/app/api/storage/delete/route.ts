import { NextRequest } from "next/server";
import { initializeApp, getApps } from "firebase/app";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { firebaseConfig } from "@/firebase/config";

// Initialize Firebase if not already initialized
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const storage = getStorage();

export async function DELETE(req: NextRequest) {
  try {
    const { spaceId, userId, fileName } = await req.json();

    if (!spaceId || !userId || !fileName) {
      return new Response("Missing required fields", { status: 400 });
    }

    // Create storage reference
    const storageRef = ref(storage, `spaces/${spaceId}/${userId}/${fileName}`);
    
    // Delete file
    await deleteObject(storageRef);

    return Response.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return new Response("Delete failed", { status: 500 });
  }
}
