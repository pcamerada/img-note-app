import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Tooltip as ReactTooltip } from "react-tooltip";
import {
  LuCheck,
  LuChevronLeft,
  LuCircle,
  LuRectangleHorizontal,
  LuUploadCloud,
  LuX,
} from "react-icons/lu";
import CanvaComponent from "../components/CanvaComponent";
import NotesComponent from "../components/NotesComponent";
import { NoteModel } from "../models/Note";
import { ShapeModel } from "../models/Shape";
import { useServer } from "../contexts/ServerContext";
import { useHelper } from "../contexts/HelperContext";

const Detail = () => {
  const {
    callSaveImage,
    callGetImage,
    callSaveNote,
    callUpdateNote,
    callGetNoteListByImage,
  } = useServer();
  const { showAlert } = useHelper();

  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState<string | null>(null);
  const [imageId, setImageId] = useState<string>("");

  const [note, setNote] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>("");
  const [noteList, setNoteList] = useState<NoteModel[]>([]);

  const [shape, setShape] = useState<ShapeModel | null>(null);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      if (id) {
        Promise.all([callGetImage(id), callGetNoteListByImage(id)]).then(
          ([image, notes]) => {
            setImageId(id);
            setImage(image.image);
            setNoteList(notes);
            getSession();
          }
        );
      }
    };
    fetchImage();
  }, [id]);

  useEffect(() => {
    if (id === undefined && image) {
      const id = uuidv4();
      setImageId(id);
      callSaveImage(id, image);
    }
  }, [image]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveNote = async () => {
    const promiseList: Promise<any>[] = [];
    if (selectedNoteId && note && shape) {
      promiseList.push(callUpdateNote(selectedNoteId, imageId, note, shape));
    } else if (!selectedNoteId && note && shape) {
      const id = uuidv4();
      promiseList.push(callSaveNote(id, imageId, note, shape));
    }
    promiseList.push(callGetNoteListByImage(imageId));
    Promise.all(promiseList).then(([_, notes]) => {
      setNoteList(notes);
      setShape(null);
      setSelectedShape(null);
      setNote("");
      clearSession();
    });
  };

  const addShape = (shape: string) => {
    setSelectedShape(shape);
  };

  const handleTriggerShape = (triggeredShape: ShapeModel) => {
    if (triggeredShape.x !== shape?.x || triggeredShape.y !== shape?.y) {
      setShape(triggeredShape);
    }
  };

  const handleDeleteAnnotation = () => {
    setShape(null);
    setSelectedShape(null);
    setNote("");
    clearSession();
  };

  const handleSelectNote = (note: any) => {
    setSelectedNoteId(note.id);
    setShape(note.shape);
    setSelectedShape(note.shape.type);
    setNote(note.note);
  };

  const saveSession = () => {
    const session = {
      imageId,
      note,
      shape,
    };
    sessionStorage.setItem("session", JSON.stringify(session));
    showAlert({ type: "success", message: "Session saved successfully!" });
  };

  const getSession = () => {
    const session = sessionStorage.getItem("session");
    if (session) {
      const { imageId, note, shape } = JSON.parse(session);
      if (imageId === id) {
        setNote(note);
        setShape(shape);
        setSelectedShape(shape?.type === "circle" ? "circle" : "rectangle");
      }
    }
  };

  const clearSession = () => {
    sessionStorage.removeItem("session");
  };

  return (
    <div className="p-2 w-full">
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 px-3 py-2 flex bg-blue-50 hover:bg-blue-100 text-blue-700 rounded"
      >
        <LuChevronLeft className="h-6 w-6" />
        Go to Gallery
      </button>

      {!image && (
        <div className="mb-4 w-full flex flex-col justify-center items-center">
          <h2 className="text-lg font-semibold mb-2">Upload an Image</h2>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
          />
        </div>
      )}
      {image && (
        <div className="mt-4 w-full">
          <h2 className="text-lg font-semibold mb-2">Image Preview:</h2>
          <div className="flex gap-8 justify-center pt-4">
            <CanvaComponent
              image={image}
              selectedShape={selectedShape}
              triggerShape={handleTriggerShape}
              inputShape={shape}
            />
            <div className="flex flex-col justify-start items-center gap-4 ml-4">
              <button
                className={`p-2 rounded-full to-blue-500 ${
                  shape && note
                    ? "bg-blue-100 hover:bg-blue-400"
                    : "bg-gray-100 cursor-default"
                }`}
                onClick={saveSession}
                disabled={!shape && !note}
                data-tooltip-id="tooltip-save-session"
              >
                <LuUploadCloud className="h-6 w-6" />
              </button>
              <button
                className={`p-2 rounded-full to-blue-500 ${
                  selectedShape === "rectangle" ? "bg-blue-400" : "bg-blue-100"
                }`}
                onClick={() => addShape("rectangle")}
                data-tooltip-id="tooltip-set-rectangle"
              >
                <LuRectangleHorizontal className="h-6 w-6" />
              </button>
              <button
                className={`p-2 rounded-full to-blue-500 ${
                  selectedShape === "circle" ? "bg-blue-400" : "bg-blue-100"
                }`}
                onClick={() => addShape("circle")}
                data-tooltip-id="tooltip-set-circle"
              >
                <LuCircle className="h-6 w-6" />
              </button>
              <button
                className={`p-2 rounded-full ${
                  note && shape
                    ? "bg-green-100 hover:bg-green-400"
                    : "bg-gray-100 cursor-default"
                }`}
                onClick={handleSaveNote}
                disabled={!shape && !note}
                data-tooltip-id="tooltip-save"
              >
                <LuCheck className="h-6 w-6" />
              </button>
              <button
                className={`p-2 rounded-full ${
                  shape && note
                    ? "bg-red-100 hover:bg-red-300"
                    : "bg-gray-100 cursor-default"
                }`}
                onClick={handleDeleteAnnotation}
                disabled={!shape && !note}
                data-tooltip-id="tooltip-clear"
              >
                <LuX className="h-6 w-6" />
              </button>
            </div>
          </div>
          {(selectedShape || note) && (
            <div className="mt-4">
              <textarea
                value={note || ""}
                onChange={(e) => setNote(e.target.value)}
                className="block w-full text-sm text-gray-500 border border-gray-300 rounded p-2"
                rows={2}
                placeholder="Add your notes here..."
              />
            </div>
          )}
          <NotesComponent
            imageId={imageId}
            noteList={noteList}
            selectedNote={handleSelectNote}
          />
        </div>
      )}
      {shape && note && (
        <ReactTooltip
          id="tooltip-save-session"
          place="left"
          variant="info"
          content="Save Session"
        />
      )}
      <ReactTooltip
        id="tooltip-set-rectangle"
        place="left"
        variant="info"
        content="Set Rectangle"
      />
      <ReactTooltip
        id="tooltip-set-circle"
        place="left"
        variant="info"
        content="Set Circle"
      />
      {shape && note && (
        <ReactTooltip
          id="tooltip-save"
          place="left"
          variant="info"
          content="Save Annotation"
        />
      )}
      {shape && note && (
        <ReactTooltip
          id="tooltip-clear"
          place="left"
          variant="info"
          content="Clear"
        />
      )}
    </div>
  );
};

export default Detail;
