import { ApiPropertyOptional } from '@nestjs/swagger';
import type { GeoJSONGeometry } from 'src/common/types/geojson.types';

export class UpdateMapDto {
    @ApiPropertyOptional({ description: 'Map name', example: 'Карта подосиновиков' })
    name?: string;

    @ApiPropertyOptional({ description: 'Map description', example: 'На этой карте находятся все подосиновики в районе.' })
    description?: string;

    @ApiPropertyOptional({ description: 'Map center coordinates', example: { type: 'Point', coordinates: [50.33, 33.5] } })
    location?: GeoJSONGeometry;

    @ApiPropertyOptional({ description: 'Visibility flag', example: true })
    visible?: boolean;

    @ApiPropertyOptional({ description: 'Tag IDs', example: ['1', '3'], type: [String] })
    tags?: string[];
}