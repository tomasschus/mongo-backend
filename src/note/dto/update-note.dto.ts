import { PartialType } from '@nestjs/mapped-types';
import { CreateNoteDto } from './create-note.dto';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {}

export class SyncNoteDto {
    toSyncNotes: UpdateNoteDto[];
    deletedNotes: string[];
}
