import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Note, NoteDocument } from './schemas/notes.schema';
import { Model, Types } from 'mongoose';
import { Request } from 'express';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name) private readonly noteModel: Model<NoteDocument>,
  ) { }

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const newNote = new this.noteModel(createNoteDto);
    newNote._id = null
    return newNote.save()
  }

  async findAll(request: Request): Promise<Note[]> {
    return this.noteModel
      .find(request.query)
      .setOptions({ sanitizeFilter: true })
      .exec();
  }

  async findAllByUserId(userId: String, deleted: boolean = false): Promise<Note[]> {
    return this.noteModel
      .find({ userId, deleted })
      .setOptions({ sanitizeFilter: true })
      .exec();
  }

  async findOne(id: string): Promise<Note> {
    return this.noteModel
      .findOne({ id })
      .exec();
  }

  async update(id: Types.ObjectId, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const documentExists = await this.noteModel.exists({ _id: id });
    if (!documentExists) {
      throw new Error(`Document with ID ${id} does not exist.`);
    }

    const res = await this.noteModel.findByIdAndUpdate(id, updateNoteDto).exec();

    console.log(id, res);
    return res;
  }

  async remove(noteUUID: string) {
    return this.noteModel.findOneAndRemove({ noteUUID }).exec();
  }


  async setDeletedByNoteUUID(noteUUID: string) {
    const note = await this.noteModel
      .findOne({ noteUUID })
      .setOptions({ sanitizeFilter: true })
      .exec();

    if (note) {
      note.deleted = true;
      await this.noteModel.findByIdAndUpdate(note.id, note).exec();
    }
  }

  async restoreNoteByNoteIdAndUserId(userId: string, noteUUID: string): Promise<Note> {
    const findedNote = await this.noteModel
      .findOne({ userId, noteUUID, deleted: true })
      .setOptions({ sanitizeFilter: true })
      .exec();

    if (!findedNote){
      return;
    }

    findedNote.deleted = false;
    const res = await this.noteModel.findByIdAndUpdate(findedNote.id, findedNote).exec();

    return res;
  }
}
