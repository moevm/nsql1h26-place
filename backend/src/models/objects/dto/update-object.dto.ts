import { ApiPropertyOptional } from '@nestjs/swagger';
import { type GeoJSONGeometry, ObjectType } from 'src/common/types/geojson.types';

export class UpdateObjectDto {
  @ApiPropertyOptional({ description: 'Object type', enum: ObjectType, example: ObjectType.POINT })
  type?: ObjectType;

  @ApiPropertyOptional({ description: 'Object name', example: 'Опушка у берез' })
  name?: string;

  @ApiPropertyOptional({ description: 'Object description', example: 'Здесь очень много черники' })
  description?: string;

  @ApiPropertyOptional({ description: 'Object tags', example: ['forest', 'parking'], type: [String] })
  tags?: string[];

  @ApiPropertyOptional({ description: 'GeoJSON geometry', example: { type: 'Point', coordinates: [30.775178, 59.773007] } })
  location?: GeoJSONGeometry;

  @ApiPropertyOptional({ description: 'Object image path', maxLength: 255, example: 'objects/object_icon.png' })
  image_path?: string;
}