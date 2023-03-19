import { ApiProperty } from '@nestjs/swagger';
export class CreateNoteDto {
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
