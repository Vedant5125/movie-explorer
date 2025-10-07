import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  favoriteMovies: string[];
}

export interface IUserDocument extends IUser, Document {
  _id: mongoose.Types.ObjectId;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favoriteMovies: [{ type: String }],
  },
  { timestamps: true }
);

const UserModel: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);

export default UserModel;
