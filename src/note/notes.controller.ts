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
import { UpdateNoteDto } from './dto/update-note.dto';
import { ParseObjectIdPipe } from '../utilities/parse-object-id-pipe.pipe';
import { isGivenNoteAfter } from 'src/helpers/isGivenNoteAfter';
import { Types } from 'mongoose';

@Controller('notes')
@ApiTags('note')
export class NotesController {
  constructor(
    private readonly notesService: NotesService,
  ) { }

  // @Post()
  // create(@Body() createNoteDto: CreateNoteDto) {
  //   return this.notesService.create(createNoteDto);
  // }

  // @Get()
  // findAll(@Req() request: Request) {
  //   return this.notesService.findAll(request);
  // }

  @Post('sync/:userId')
  async syncNotesByUserId(
    @Param('userId') userId: string,
    @Body() notesDto: UpdateNoteDto[]
  ) {
    try {
      const notes = await this.notesService.findAllByUserId(userId);
  
      if (notes && notesDto.length) {
        const promises = notesDto.map(async (syncNote) => {
          const noteAlreadySaved = notes.find(savedNote => savedNote.noteUUID === syncNote.noteUUID);
          console.log(noteAlreadySaved)
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
    } catch (error) {
      console.error(error);
    }
  
    return await this.notesService.findAllByUserId(userId);
  }
  

  // @Get(':id')
  // findOne(@Param('id', ParseObjectIdPipe) id: string) {
  //   return this.notesService.findOne(id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  //   @Body() updateNoteDto: UpdateNoteDto,
  // ) {
  //   return this.notesService.update(id, updateNoteDto);
  // }

  // @Delete(':id')
  // remove(@Param('id', ParseObjectIdPipe) id: string) {
  //   return this.notesService.remove(id);
  // }

}
