import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { SyncNoteDto, UpdateNoteDto } from './dto/update-note.dto';
import { isGivenNoteAfter } from 'src/helpers/isGivenNoteAfter';

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
      const { toSyncNotes, deletedNotes } = syncNotes;
      if (notes && toSyncNotes?.length) {
        const promises = toSyncNotes.map(async (syncNote) => {
          const noteAlreadySaved = notes.find(savedNote => savedNote.noteUUID === syncNote.noteUUID);
          if (!noteAlreadySaved) {
            console.log("creando nota")
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
              deleted: false,
              expiration: syncNote.expiration,
              lastModified: syncNote.lastModified
            };
            await this.notesService.create(createNoteDto);
          } else if (noteAlreadySaved && !noteAlreadySaved.deleted && isGivenNoteAfter(noteAlreadySaved, syncNote)) {
            const updateNoteDto: UpdateNoteDto = {
              title: syncNote.title,
              note: syncNote.note,
              shortDescription: syncNote.shortDescription,
              categories: syncNote.categories,
              image: syncNote.image,
              color: syncNote.color,
              closed: syncNote.closed,
              deleted: false,
              expiration: syncNote.expiration,
              lastModified: syncNote.lastModified
            };

            await this.notesService.update(noteAlreadySaved._id, updateNoteDto);
          }
        });

        await Promise.all(promises);
      }

      if (deletedNotes && deletedNotes?.length) {
        await Promise.all(deletedNotes.map(noteUUID => this.notesService.setDeletedByNoteUUID(noteUUID)));
      }

    } catch (error) {
      console.error(error);
    }

    const resNotes = await this.notesService.findAllByUserId(userId);
    return resNotes;
  }


  @Get('deleted/:userId')
  async getDeletedNotes(
    @Param('userId') userId: string,
  ) {
    const resNotes = await this.notesService.findAllByUserId(userId, true);
    return resNotes;
  }
}
