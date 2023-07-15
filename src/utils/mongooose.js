import mongoose from "mongoose";

export const convertObjectIdMongoose = (id) => new mongoose.Types.ObjectId(id);
