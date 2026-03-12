import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'New username', example: 'Joku_Updated' })
  username?: string;

  @ApiPropertyOptional({ description: 'Profile image path', example: 'avatar_new.png' })
  image_path?: string;
}
