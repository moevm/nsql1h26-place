import { ApiPropertyOptional } from '@nestjs/swagger';

class CoordinatesDto {
    @ApiPropertyOptional({ description: 'Latitude', example: 59.773007 })
    x?: number;

    @ApiPropertyOptional({ description: 'Longitude', example: 30.775178 })
    y?: number;
}

export class UpdateMapDto {
    @ApiPropertyOptional({ description: 'Map name', example: 'Карта подосиновиков' })
    name?: string;

    @ApiPropertyOptional({ description: 'Map description', example: 'На этой карте находятся все подосиновики в районе.' })
    description?: string;

    @ApiPropertyOptional({ description: 'Map center coordinates', type: CoordinatesDto })
    coordinates?: CoordinatesDto;

    @ApiPropertyOptional({ description: 'Visibility flag', example: true })
    visible?: boolean;

    @ApiPropertyOptional({ description: 'Tag IDs', example: ['1', '3'], type: [String] })
    tags?: string[];
}