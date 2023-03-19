import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NoteDocument = Note & Document;

@Schema()
export class Note {
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
  expiration: Date;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
