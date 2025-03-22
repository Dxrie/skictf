import mongoose, {Schema, Document} from "mongoose";

export interface IPublish extends Document {
  publish: boolean;
}

const PublishSchema: Schema = new Schema({
  publish: {type: Boolean, required: true},
});

export const PublishModel =
  mongoose.models.Publish || mongoose.model<IPublish>("Publish", PublishSchema);
