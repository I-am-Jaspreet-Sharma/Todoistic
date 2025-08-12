import mongoose from "mongoose"

export interface ITodo{
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  task: string;
  isCompleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const todoSchema = new mongoose.Schema<ITodo>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  task: {
    type: String,
    required: true,
    trim: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
}, {timestamps: true})

const Todo = mongoose.models?.Todo || mongoose.model<ITodo>("Todo", todoSchema)

export default Todo
