import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Note, NoteDocument } from './schemas/notes.schema';
import { Model } from 'mongoose';
import { Request } from 'express';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name) private readonly noteModel: Model<NoteDocument>,
  ) {}

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    return this.noteModel.create(createNoteDto);
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
      .findOne({ _id: id })
      .exec();
  }

  async update(id: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    return this.noteModel.findOneAndUpdate({ _id: id }, updateNoteDto, {
      new: true,
    });
  }

  async remove(id: string) {
    return this.noteModel.findByIdAndRemove({ _id: id }).exec();
  }

}
