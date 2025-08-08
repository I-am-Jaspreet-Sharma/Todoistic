import mongoose from "mongoose"

export interface ISession{
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const sessionSchema = new mongoose.Schema<ISession>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 7*24*60*60
  }
})

const Session = mongoose.models?.Session || mongoose.model<ISession>("Session", sessionSchema)

export default Session
