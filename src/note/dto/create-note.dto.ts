import { ApiProperty } from '@nestjs/swagger';

export class CreateNoteDto {
  @ApiProperty({ example: '' })
  _id?: string;

  @ApiProperty({ example: '151665446461189797621653' })
  userId: string;

  @ApiProperty({ example: '1684811808' })
  noteUUID: string;

  @ApiProperty({ example: 'Title example' })
  title: string;

  @ApiProperty({ example: 'esta es una nota de ejemplo' })
  note: string;

  @ApiProperty({ example: 'short description' })
  shortDescription?: string;

  @ApiProperty({ example: ['NestJS', 'REST API'] })
  categories?: string[];

  @ApiProperty()
  image?: string;

  @ApiProperty({ example: '#FAFAFA' })
  color?: string;

  @ApiProperty({ example: false })
  closed?: boolean;

  @ApiProperty()
  expiration?: Date | undefined; // Marcar como opcional y proporcionar valor predeterminado

  @ApiProperty()
  lastModified?: Date | undefined; // Marcar como opcional y proporcionar valor predeterminado
}
