import mongoose from "mongoose";

export interface NoteDocument extends mongoose.Document {
  content: string;
  category: mongoose.Schema.Types.ObjectId;
}

const noteSchema = new mongoose.Schema<NoteDocument>(
  {
    content: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true },
);

const NoteEntity =
  mongoose.models.NoteEntity || mongoose.model("NoteEntity", noteSchema);
export default NoteEntity;
