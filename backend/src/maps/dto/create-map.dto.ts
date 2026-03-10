import { ApiProperty } from '@nestjs/swagger';

class CoordinatesDto {
    @ApiProperty({ description: 'Latitude', example: 59.773007 })
    x: number;

    @ApiProperty({ description: 'Longitude', example: 30.775178 })
    y: number;
}

export class CreateMapDto {
    @ApiProperty({ description: 'User ObjectId', example: '507f1f77bcf86cd799439011' })
    user_id: string;

    @ApiProperty({ description: 'Map name', example: 'Карта подосиновиков' })
    name: string;

    @ApiProperty({ description: 'Map description', example: 'На этой карте находятся все подосиновики в районе.' })
    description: string;

    @ApiProperty({ description: 'Country', example: 'Россия' })
    country: string;

    @ApiProperty({ description: 'Area name', example: 'Свердловское городское поселение' })
    area: string;

    @ApiProperty({ description: 'Map center coordinates', type: CoordinatesDto })
    coordinates: CoordinatesDto;

    @ApiProperty({ description: 'Visibility flag', example: true, default: true })
    visible: boolean;

    @ApiProperty({ description: 'Tag IDs', example: ['1', '3'], type: [String], default: [] })
    tags: string[];

    @ApiProperty({ description: 'Map image path', example: 'map_icon.png', default: "map_icon.png" })
    image_path: string;
}