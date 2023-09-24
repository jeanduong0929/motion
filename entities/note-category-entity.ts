import mongoose from "mongoose";

export interface NoteCategoryDocument extends mongoose.Document {
  name: string;
  user: mongoose.Schema.Types.ObjectId;
}

const noteCategorySchema = new mongoose.Schema<NoteCategoryDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const NoteCategoryEntity =
  mongoose.models.NoteCategoryEntity ||
  mongoose.model("NoteCategoryEntity", noteCategorySchema);
export default NoteCategoryEntity;
