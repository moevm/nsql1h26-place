import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Unique username', example: 'Joku_Jokkunen' })
  username: string;

  @ApiProperty({ description: 'Raw password', example: '12345678' })
  password: string;
}
