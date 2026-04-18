import mongoose from "mongoose";

const shareSchema = new mongoose.Schema({
  playlist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Playlist",
    required: true,
  },
  sharedWith: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

shareSchema.index({ playlist: 1, sharedWith: 1 }, { unique: true });

export default mongoose.model("Share", shareSchema);
