import { ApiProperty } from '@nestjs/swagger';
import { type GeoJSONGeometry, ObjectType } from 'src/common/types/geojson.types';


export class CreateObjectDto {
  @ApiProperty({ description: 'Map ObjectId the object belongs to', example: '507f1f77bcf86cd799439011' })
  map_id: string;

  @ApiProperty({ description: 'Object type', enum: ObjectType, example: ObjectType.POINT })
  type: ObjectType;

  @ApiProperty({ description: 'Object name', example: 'Опушка у берез' })
  name: string;

  @ApiProperty({ description: 'Object description', example: 'Здесь очень много черники' })
  description?: string;

  @ApiProperty({ description: 'Object tags', example: ['черника', 'подосиновик'], type: [String], default: [] })
  tags?: string[];

  @ApiProperty({ description: 'GeoJSON geometry', example: { type: 'Point', coordinates: [30.775178, 59.773007] } })
  location: GeoJSONGeometry;

  @ApiProperty({ description: 'Object image path', example: 'objects/object_icon.png', default: '' })
  image_path: string;
}