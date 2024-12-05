import { LuFileEdit, LuX } from "react-icons/lu";
import { deleteNote, getNoteListByImage } from "../utils/db";
import { NoteModel } from "../models/Note";
import { useEffect, useState } from "react";

type NotesComponentProps = {
  imageId: string;
  noteList: NoteModel[];
  selectedNote: (note: NoteModel) => void;
};

const NotesComponent = ({
    imageId,
    noteList,
    selectedNote
} : NotesComponentProps) => {
    const [notes, setNotes] = useState<NoteModel[]>([])

    useEffect(() => {
      setNotes(noteList)
    }, [noteList])
    

  const handleDeleteNote = (note: NoteModel) => {
    deleteNote(note.id).then(() => {
      getNoteListByImage(imageId).then((notes) => {
        setNotes(notes);
      });
    });
  };

  return (
    <div className="mt-4 w-full">
      <h2 className="text-lg font-semibold mb-2">Notes:</h2>
      <div className="max-h-60 overflow-y-auto">
        {notes.map((note: NoteModel) => (
          <div
            key={note.id}
            className="flex justify-between p-2 hover:border hover:border-blue-300 rounded-lg"
          >
            <span className="mb-2">{note.note}</span>
            <div className="flex">
              <button onClick={() => selectedNote(note)}>
                <LuFileEdit className="h-6 w-6" />
              </button>
              <button onClick={() => handleDeleteNote(note)}>
                <LuX className="h-6 w-6" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesComponent;
