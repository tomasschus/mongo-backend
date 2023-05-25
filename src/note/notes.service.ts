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
  ) {}

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

  async findAllByUserId(userId: String): Promise<Note[]> {
    return this.noteModel
      .find({userId})
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
  
    const res = await this.noteModel.findByIdAndUpdate(id, updateNoteDto, {
      new: true,
    }).exec();
  
    console.log(id, res);
    return res;
  }  

  async remove(id: Types.ObjectId) {
    return this.noteModel.findByIdAndRemove(id).exec();
  }

}
