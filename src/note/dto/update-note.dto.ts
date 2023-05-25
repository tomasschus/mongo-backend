import { PartialType } from '@nestjs/mapped-types';
import { CreateNoteDto } from './create-note.dto';
import { Types } from 'mongoose';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {}

export class SyncNoteDto {
    toSyncNotes: UpdateNoteDto[];
    deletedNotes: Types.ObjectId[];
}
