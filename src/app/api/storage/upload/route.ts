import { NextRequest } from "next/server";
import { initializeApp, getApps } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll } from "firebase/storage";
import { firebaseConfig } from "@/firebase/config";

// Initialize Firebase if not already initialized
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const storage = getStorage();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const spaceId = formData.get("spaceId") as string;
    const userId = formData.get("userId") as string;

    if (!file || !spaceId || !userId) {
      return new Response("Missing required fields", { status: 400 });
    }

    // Create storage reference
    const storageRef = ref(storage, `spaces/${spaceId}/${userId}/${file.name}`);
    
    // Convert file to buffer
    const buffer = await file.arrayBuffer();
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, buffer, {
      contentType: file.type,
    });

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return Response.json({
      success: true,
      downloadURL,
      fileName: file.name,
      size: file.size,
      contentType: file.type,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return new Response("Upload failed", { status: 500 });
  }
}
