import React, { createContext, useContext, ReactNode } from "react";
import {
  saveImage,
  getImage,
  getAllImages,
  deleteImage,
  saveNote,
  updateNote,
  deleteNote,
  getNoteListByImage,
} from "../utils/db";
import { useHelper } from "./HelperContext";
import { NoteModel } from "../models/Note";
import { ImageModel } from "../models/Image";
import { ShapeModel } from "../models/Shape";

interface ServerContextProps {
  callSaveImage: (id: string, image: string) => Promise<void>;
  callGetImage: (id: string) => Promise<ImageModel>;
  callGetAllImages: () => Promise<ImageModel[]>;
  callDeleteImage: (id: string) => Promise<void>;
  callSaveNote: (id: string, imageId: string, note: string, shape: ShapeModel) => Promise<void>;
  callUpdateNote: (id: string, imageId: string, note: string, shape: ShapeModel) => Promise<void>;
  callDeleteNote: (id: string) => Promise<void>;
  callGetNoteListByImage: (imageId: string) => Promise<NoteModel[]>;
}

const ServerContext = createContext<ServerContextProps | undefined>(undefined);

export const ServerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { showAlert, showLoader, hideLoader } = useHelper();

  const callSaveImage = (id: string, image: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        showLoader();
        await saveImage(id, image);
        resolve();
        showAlert({ type: "success", message: "Image saved successfully" });
      } catch (error) {
        reject(error);
        showAlert({ type: "error", message: "Failed to save image" });
      } finally {
        hideLoader();
      }
    });
  };

  const callGetImage = (id: string): Promise<ImageModel> => {
    return new Promise(async (resolve, reject) => {
      try {
        showLoader();
        const image = await getImage(id);
        resolve(image);
      } catch (error) {
        reject(error);
        showAlert({ type: "error", message: "Failed to load image" });
      } finally {
        hideLoader();
      }
    });
  };

  const callGetAllImages = (): Promise<ImageModel[]> => {
    return new Promise(async (resolve, reject) => {
      try {
        showLoader();
        const images = await getAllImages();
        resolve(images);
      } catch (error) {
        reject(error);
        showAlert({ type: "error", message: "Failed to load images" });
      } finally {
        hideLoader();
      }
    });
  };

  const callDeleteImage = (id: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        showLoader();
        await deleteImage(id);
        resolve();
        showAlert({ type: "success", message: "Image deleted successfully" });
      } catch (error) {
        reject(error);
        showAlert({ type: "error", message: "Failed to delete image" });
      } finally {
        hideLoader();
      }
    });
  };

  const callSaveNote = (id: string, imageId: string, note: string, shape: ShapeModel): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        showLoader();
        await saveNote(id, imageId, note, shape);
        resolve();
        showAlert({ type: "success", message: "Note saved successfully" });
      } catch (error) {
        reject(error);
        showAlert({ type: "error", message: "Failed to save note" });
      } finally {
        hideLoader();
      }
    });
  };

  const callUpdateNote = (id: string, imageId: string, note: string, shape: ShapeModel): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        showLoader();
        await updateNote(id, imageId, note, shape);
        resolve();
        showAlert({ type: "success", message: "Note updated successfully" });
      } catch (error) {
        reject(error);
        showAlert({ type: "error", message: "Failed to update note" });
      } finally {
        hideLoader();
      }
    });
  };

  const callDeleteNote = (id: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        showLoader();
        await deleteNote(id);
        resolve();
        showAlert({ type: "success", message: "Note deleted successfully" });
      } catch (error) {
        reject(error);
        showAlert({ type: "error", message: "Failed to delete note" });
      } finally {
        hideLoader();
      }
    });
  };

  const callGetNoteListByImage = (imageId: string): Promise<NoteModel[]> => {
    return new Promise(async (resolve, reject) => {
      try {
        showLoader();
        const notes = await getNoteListByImage(imageId);
        resolve(notes);
      } catch (error) {
        reject(error);
        showAlert({ type: "error", message: "Failed to get notes" });
      } finally {
        hideLoader();
      }
    });
  };

  return (
    <ServerContext.Provider
      value={{
        callSaveImage,
        callGetImage,
        callGetAllImages,
        callDeleteImage,
        callSaveNote,
        callUpdateNote,
        callDeleteNote,
        callGetNoteListByImage
      }}
    >
      {children}
    </ServerContext.Provider>
  );
};

export const useServer = (): ServerContextProps => {
  const context = useContext(ServerContext);
  if (!context) {
    throw new Error("useServer must be used within a ServerProvider");
  }
  return context;
};
