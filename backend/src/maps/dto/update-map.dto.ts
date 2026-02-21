import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMapDto {
    @ApiPropertyOptional({ description: 'ID of the user who owns the map', example: '507f1f77bcf86cd799439011' })
    userid?: string;
}