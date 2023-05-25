import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export type NoteDocument = HydratedDocument<Note>;

@Schema()
export class Note {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId


  @Prop({required: true})
  userId: string;

  @Prop({unique: true, required: true})
  noteUUID: string;

  @Prop()
  title: string;

  @Prop()
  shortDescription: string;

  @Prop()
  note: string;

  @Prop()
  categories: string[];

  @Prop()
  image: string;

  @Prop()
  color: string;

  @Prop()
  closed: boolean;

  @Prop()
  deleted: boolean;

  @Prop()
  expiration: Date;

  @Prop()
  lastModified: Date;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
