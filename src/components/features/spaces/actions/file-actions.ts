/**
 * @fileoverview This file contains server-side actions for file management within spaces.
 * It provides functions for uploading, downloading, deleting, and listing files
 * from Firebase Storage. These actions are designed to be called from client-side
 * components and handle the direct interaction with the storage service.
 */
'use server';

import { initializeApp, getApps } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll, getMetadata } from "firebase/storage";
import { firebaseConfig } from "@/firebase/config";

// Initialize Firebase if not already initialized
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const storage = getStorage();

export interface FileActionItem {
  name: string;
  size: number;
  contentType: string;
  timeCreated: string;
  updated: string;
}

export interface UploadResult {
  success: boolean;
  downloadURL?: string;
  fileName?: string;
  size?: number;
  contentType?: string;
  error?: string;
}

export interface DownloadResult {
  success: boolean;
  downloadURL?: string;
  error?: string;
}

export interface DeleteResult {
  success: boolean;
  message?: string;
  error?: string;
}

export interface ListResult {
  success: boolean;
  files?: FileActionItem[];
  error?: string;
}

export async function uploadFileAction(
  formData: FormData
): Promise<UploadResult> {
  try {
    const file = formData.get("file") as File;
    const spaceId = formData.get("spaceId") as string;
    const userId = formData.get("userId") as string;

    if (!file || !spaceId || !userId) {
      return {
        success: false,
        error: "Missing required fields"
      };
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

    return {
      success: true,
      downloadURL,
      fileName: file.name,
      size: file.size,
      contentType: file.type,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      error: "Upload failed"
    };
  }
}

export async function downloadFileAction(
  spaceId: string,
  userId: string,
  fileName: string
): Promise<DownloadResult> {
  try {
    if (!spaceId || !userId || !fileName) {
      return {
        success: false,
        error: "Missing required fields"
      };
    }

    // Create storage reference
    const storageRef = ref(storage, `spaces/${spaceId}/${userId}/${fileName}`);
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);

    return {
      success: true,
      downloadURL,
    };
  } catch (error) {
    console.error("Download error:", error);
    return {
      success: false,
      error: "Download failed"
    };
  }
}

export async function deleteFileAction(
  spaceId: string,
  userId: string,
  fileName: string
): Promise<DeleteResult> {
  try {
    if (!spaceId || !userId || !fileName) {
      return {
        success: false,
        error: "Missing required fields"
      };
    }

    // Create storage reference
    const storageRef = ref(storage, `spaces/${spaceId}/${userId}/${fileName}`);
    
    // Delete file
    await deleteObject(storageRef);

    return {
      success: true,
      message: "File deleted successfully",
    };
  } catch (error) {
    console.error("Delete error:", error);
    return {
      success: false,
      error: "Delete failed"
    };
  }
}

export async function listFilesAction(
  spaceId: string,
  userId: string
): Promise<ListResult> {
  try {
    if (!spaceId || !userId) {
      return {
        success: false,
        error: "Missing required parameters"
      };
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
          contentType: metadata.contentType || 'application/octet-stream',
          timeCreated: metadata.timeCreated,
          updated: metadata.updated,
        };
      })
    );

    return {
      success: true,
      files,
    };
  } catch (error) {
    console.error("List files error:", error);
    return {
      success: false,
      error: "Failed to list files"
    };
  }
}
