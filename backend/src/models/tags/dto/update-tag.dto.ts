import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTagDto {
  @ApiPropertyOptional({ description: 'Tag name', maxLength: 100, example: 'Опасная зона' })
  name?: string;

  @ApiPropertyOptional({ description: 'Tag image path', maxLength: 255, example: 'tags/danger.png' })
  image_path?: string;
}