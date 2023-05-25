import { Req } from '@nestjs/common';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { SyncNoteDto, UpdateNoteDto } from './dto/update-note.dto';
import { ParseObjectIdPipe } from '../utilities/parse-object-id-pipe.pipe';
import { isGivenNoteAfter } from 'src/helpers/isGivenNoteAfter';
import { Types } from 'mongoose';

@Controller('notes')
@ApiTags('note')
export class NotesController {
  constructor(
    private readonly notesService: NotesService,
  ) { }

  @Post('sync/:userId')
  async syncNotesByUserId(
    @Param('userId') userId: string,
    @Body() syncNotes: SyncNoteDto
  ) {
    try {
      const notes = await this.notesService.findAllByUserId(userId);
      const {toSyncNotes, deletedNotes} = syncNotes;
  
      if (notes && toSyncNotes.length) {
        const promises = toSyncNotes.map(async (syncNote) => {
          const noteAlreadySaved = notes.find(savedNote => savedNote.noteUUID === syncNote.noteUUID);
          if (!noteAlreadySaved) {
            // La nota no existe, crearla
            const createNoteDto: CreateNoteDto = {
              userId: userId,
              noteUUID: syncNote.noteUUID,
              title: syncNote.title,
              note: syncNote.note,
              shortDescription: syncNote.shortDescription,
              categories: syncNote.categories,
              image: syncNote.image,
              color: syncNote.color,
              closed: syncNote.closed,
              expiration: syncNote.expiration,
              lastModified: syncNote.lastModified
            };
            await this.notesService.create(createNoteDto);
          } else if (noteAlreadySaved && isGivenNoteAfter(noteAlreadySaved, syncNote)) {
            const updateNoteDto: UpdateNoteDto = {
              title: syncNote.title,
              note: syncNote.note,
              shortDescription: syncNote.shortDescription,
              categories: syncNote.categories,
              image: syncNote.image,
              color: syncNote.color,
              closed: syncNote.closed,
              expiration: syncNote.expiration,
              lastModified: syncNote.lastModified
            };
            
            await this.notesService.update(noteAlreadySaved._id, updateNoteDto);
          }
        });
  
        await Promise.all(promises);
      }

      if (deletedNotes && deletedNotes.length) {
        await Promise.all(deletedNotes.map(noteId => this.notesService.remove(noteId)));
      }      

    } catch (error) {
      console.error(error);
    }
  
    return await this.notesService.findAllByUserId(userId);
  }

}
