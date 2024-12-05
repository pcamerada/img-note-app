import { openDB } from "idb";
import { NoteModel } from "../models/Note";

const DB_NAME = "imageGallery";
const IMAGE_STORE_NAME = "images";
const NOTE_STORE_NAME = "notes";

export const initDB = async () => {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(IMAGE_STORE_NAME)) {
        db.createObjectStore(IMAGE_STORE_NAME, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(NOTE_STORE_NAME)) {
        const noteStore = db.createObjectStore(NOTE_STORE_NAME, {
          keyPath: "id",
        });
        noteStore.createIndex("imageId", "imageId", { unique: false });
      }
    },
  });
  return db;
};

export const saveImage = (id: string, image: string): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await initDB();
      const tx = db.transaction(IMAGE_STORE_NAME, "readwrite");
      const store = tx.objectStore(IMAGE_STORE_NAME);
      await store.put({ id, image });
      await tx.done;
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const getImage = (id: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await initDB();
      const tx = db.transaction(IMAGE_STORE_NAME, "readonly");
      const store = tx.objectStore(IMAGE_STORE_NAME);
      const image = await store.get(id);
      resolve(image);
    } catch (error) {
      reject(error);
    }
  });
};

export const getAllImages = (): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await initDB();
      const tx = db.transaction(IMAGE_STORE_NAME, "readonly");
      const store = tx.objectStore(IMAGE_STORE_NAME);
      const images = await store.getAll();
      resolve(images);
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteImage = (id: string): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await initDB();
      const tx = db.transaction(IMAGE_STORE_NAME, "readwrite");
      const store = tx.objectStore(IMAGE_STORE_NAME);
      await store.delete(id);
      await tx.done;
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const saveNote = (
  id: string,
  imageId: string,
  note: string,
  shape: any
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await initDB();
      const tx = db.transaction(NOTE_STORE_NAME, "readwrite");
      const store = tx.objectStore(NOTE_STORE_NAME);
      await store.put({ id, imageId, note, shape });
      await tx.done;
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const updateNote = (
  id: string,
  imageId: string,
  note: string,
  shape: any
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await initDB();
      const tx = db.transaction(NOTE_STORE_NAME, "readwrite");
      const store = tx.objectStore(NOTE_STORE_NAME);
      const existingNote = await store.get(id);
      if (existingNote) {
        await store.put({ id, imageId, note, shape });
        await tx.done;
        resolve();
      } else {
        reject(new Error("Note not found"));
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteNote = (id: string): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await initDB();
      const tx = db.transaction(NOTE_STORE_NAME, "readwrite");
      const store = tx.objectStore(NOTE_STORE_NAME);
      await store.delete(id);
      await tx.done;
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const getNoteListByImage = (imageId: string): Promise<NoteModel[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await initDB();
      const tx = db.transaction(NOTE_STORE_NAME, "readonly");
      const store = tx.objectStore(NOTE_STORE_NAME);
      const index = store.index("imageId");
      const notes = await index.getAll(imageId);
      resolve(notes);
    } catch (error) {
      reject(error);
    }
  });
};