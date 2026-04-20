import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({ description: 'Tag name', maxLength: 100, example: 'Опасная зона' })
  name: string;

  @ApiProperty({ description: 'Tag image path', maxLength: 255, example: 'tags/danger.png' })
  image_path: string;
}