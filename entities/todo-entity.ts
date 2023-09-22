import mongoose from "mongoose";

export interface TodoDocumnet extends mongoose.Document {
  title: string;
  completed: boolean;
  order: number;
  user: mongoose.Schema.Types.ObjectId;
}

const todoSchema = new mongoose.Schema<TodoDocumnet>(
  {
    title: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const TodoEntity = mongoose.models.Todo || mongoose.model("Todo", todoSchema);
export default TodoEntity;
