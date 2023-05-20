import { ApiProperty } from '@nestjs/swagger';
export class CreateNoteDto {
  @ApiProperty({ example: '23d23d23-d23p-3223-d23d2d32' })
  userId: string;

  @ApiProperty({ example: 'Title example' })
  title: string;

  @ApiProperty({ example: 'short description' })
  shortDescription: string;

  @ApiProperty({ example: 'esta es una nota de ejemplo' })
  note: string;

  @ApiProperty({ example: ['NestJS', 'REST API'] })
  categories: string[];

  @ApiProperty({})
  image: string;

  @ApiProperty({ example: '#FAFAFA' })
  color: string;

  @ApiProperty({ example: false })
  closed: boolean;

  @ApiProperty({})
  expiration: Date;
}
