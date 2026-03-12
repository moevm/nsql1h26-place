import { ApiProperty } from '@nestjs/swagger';

class CoordinatesDto {
  @ApiProperty({ description: 'Point X coordinate', example: 59.773007 })
  x: number;

  @ApiProperty({ description: 'Point Y coordinate', example: 30.775178 })
  y: number;
}

export class CreatePointDto {
  @ApiProperty({ description: 'Map ObjectId the point belongs to', example: '507f1f77bcf86cd799439011' })
  map_id: string;

  @ApiProperty({ description: 'Point name', maxLength: 100, example: 'Опушка у берез' })
  name: string;

  @ApiProperty({
    description: 'Point description',
    maxLength: 500,
    example: 'Хорошее место для старта маршрута, рядом небольшая стоянка.',
  })
  description: string;

  @ApiProperty({ description: 'Tag ObjectId for point classification', example: '507f1f77bcf86cd799439012' })
  tag: string;

  @ApiProperty({ description: 'Point coordinates', type: CoordinatesDto })
  coordinates: CoordinatesDto;

  @ApiProperty({ description: 'Point avatar image path', maxLength: 255, example: 'points/point_icon.png' })
  image_path: string;
}