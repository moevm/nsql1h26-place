import { ApiProperty } from '@nestjs/swagger';

class CoordinatesDto {
  @ApiProperty({ description: 'Area center X coordinate', example: 59.773007 })
  x: number;

  @ApiProperty({ description: 'Area center Y coordinate', example: 30.775178 })
  y: number;
}

export class CreateAreaDto {
  @ApiProperty({ description: 'Map ObjectId the area belongs to', example: '507f1f77bcf86cd799439011' })
  map_id: string;

  @ApiProperty({ description: 'Area name', maxLength: 100, example: 'Березовая роща' })
  name: string;

  @ApiProperty({
    description: 'Area description',
    maxLength: 500,
    example: 'Широкая зона с плотной растительностью и несколькими входами.',
  })
  description: string;

  @ApiProperty({
    description: 'Tag ObjectIds for area classification',
    type: [String],
    example: ['507f1f77bcf86cd799439012', '507f1f77bcf86cd799439013'],
  })
  tags: string[];

  @ApiProperty({ description: 'Area center coordinates', type: CoordinatesDto })
  coordinates: CoordinatesDto;

  @ApiProperty({ description: 'Area radius', example: 300 })
  radius: number;

  @ApiProperty({ description: 'Area avatar image path', maxLength: 255, example: 'areas/area_icon.png' })
  image_path: string;
}