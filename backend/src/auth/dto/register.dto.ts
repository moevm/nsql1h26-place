import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'Unique username', example: 'Joku_Jokkunen' })
  username: string;

  @ApiProperty({ description: 'Raw password to hash', example: '12345678' })
  password: string;
}
