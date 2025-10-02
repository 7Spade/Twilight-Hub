import { NextRequest } from "next/server";
import { initializeApp, getApps } from "firebase/app";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { firebaseConfig } from "@/firebase/config";

// Initialize Firebase if not already initialized
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const storage = getStorage();

export async function POST(req: NextRequest) {
  try {
    const { spaceId, userId, fileName } = await req.json();

    if (!spaceId || !userId || !fileName) {
      return new Response("Missing required fields", { status: 400 });
    }

    // Create storage reference
    const storageRef = ref(storage, `spaces/${spaceId}/${userId}/${fileName}`);
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);

    return Response.json({
      success: true,
      downloadURL,
    });
  } catch (error) {
    console.error("Download error:", error);
    return new Response("Download failed", { status: 500 });
  }
}
