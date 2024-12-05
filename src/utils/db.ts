import { openDB } from "idb";

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

export const saveImage = async (id: string, image: string) => {
  const db = await initDB();
  const tx = db.transaction(IMAGE_STORE_NAME, "readwrite");
  const store = tx.objectStore(IMAGE_STORE_NAME);
  await store.put({ id, image });
  await tx.done;
};

export const getImage = async (id: string) => {
  const db = await initDB();
  const tx = db.transaction(IMAGE_STORE_NAME, "readonly");
  const store = tx.objectStore(IMAGE_STORE_NAME);
  const image = await store.get(id);
  return image;
};

export const getAllImages = async () => {
  const db = await initDB();
  const tx = db.transaction(IMAGE_STORE_NAME, "readonly");
  const store = tx.objectStore(IMAGE_STORE_NAME);
  const images = await store.getAll();
  return images;
};

export const deleteImage = async (id: string) => {
  const db = await initDB();
  const tx = db.transaction(IMAGE_STORE_NAME, "readwrite");
  const store = tx.objectStore(IMAGE_STORE_NAME);
  await store.delete(id);
  await tx.done;
};

export const saveNote = async (id: string, imageId: string, note: string, shape: any) => {
  const db = await initDB();
  const tx = db.transaction(NOTE_STORE_NAME, "readwrite");
  const store = tx.objectStore(NOTE_STORE_NAME);
  await store.put({ id, imageId, note, shape });
  await tx.done;
};

export const updateNote = async (id: string, imageId: string, note: string, shape: any) => {
  const db = await initDB();
  const tx = db.transaction(NOTE_STORE_NAME, "readwrite");
  const store = tx.objectStore(NOTE_STORE_NAME);
  const existingNote = await store.get(id);
  if (existingNote) {
    await store.put({ id, imageId, note, shape });
    await tx.done;
  } else {
    throw new Error("Note not found");
  }
};

export const deleteNote = async (id: string) => {
  const db = await initDB();
  const tx = db.transaction(NOTE_STORE_NAME, "readwrite");
  const store = tx.objectStore(NOTE_STORE_NAME);
  await store.delete(id);
  await tx.done;
};

export const getNoteListByImage = async (imageId: string) => {
  const db = await initDB();
  const tx = db.transaction(NOTE_STORE_NAME, "readonly");
  const store = tx.objectStore(NOTE_STORE_NAME);
  const index = store.index("imageId");
  const notes = await index.getAll(imageId);
  return notes;
};
