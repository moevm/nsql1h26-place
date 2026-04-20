import { ApiProperty } from '@nestjs/swagger';
import type { GeoJSONGeometry } from 'src/common/types/geojson.types';

export class CreateMapDto {
    @ApiProperty({ description: 'User ObjectId', example: '507f1f77bcf86cd799439011' })
    user_id: string;

    @ApiProperty({ description: 'Map name', example: 'Карта подосиновиков' })
    name: string;

    @ApiProperty({ description: 'Map description', example: 'На этой карте находятся все подосиновики в районе.' })
    description: string;

    @ApiProperty({ description: 'Area name', example: 'Свердловское городское поселение' })
    area: string;

    @ApiProperty({ description: 'Map center coordinates', example: { type: 'Point', coordinates: [50.33, 33.5] } })
    location: GeoJSONGeometry;

    @ApiProperty({ description: 'Visibility flag', example: true, default: true })
    visible: boolean;

    @ApiProperty({ description: 'Tag IDs', example: ['1', '3'], type: [String], default: [] })
    tags: string[];

    @ApiProperty({ description: 'Map image path', example: 'map_icon.png', default: "map_icon.png" })
    image_path: string;
}