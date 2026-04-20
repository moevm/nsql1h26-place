import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Username', example: 'Joku_Jokkunen' })
  username: string;

  @ApiProperty({ description: 'Raw password', example: '12345678' })
  password: string;
}
