import { ApiProperty } from '@nestjs/swagger';

export class RestoreNoteDto {

  @ApiProperty({ example: '1684811808' })
  noteUUID: string;

}
