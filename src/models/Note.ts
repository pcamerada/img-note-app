import { ShapeModel } from "./Shape";

export interface NoteModel {
    id: string;
    imageId: string;
    note: string;
    shape: ShapeModel;
}