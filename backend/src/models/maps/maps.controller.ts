import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { MapsService } from "./maps.service";
import { MapDocument } from "./schemas/maps.schema";
import { CreateMapDto } from "./dto/create-map.dto";
import { UpdateMapDto } from "./dto/update-map.dto";

@ApiTags('Maps')
@Controller("/maps")
export class MapsController {
    constructor(private readonly mapsService: MapsService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new map' })
    @ApiResponse({ status: 201, description: 'Map created successfully' })
    async create(@Body() createMapDto: CreateMapDto): Promise<MapDocument> {
        return this.mapsService.create(createMapDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all maps' })
    @ApiResponse({ status: 200, description: 'List of all maps' })
    async findAll(): Promise<MapDocument[]> {
        return this.mapsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a map by ID' })
    @ApiParam({ name: 'id', description: 'Map ID' })
    @ApiResponse({ status: 200, description: 'Map found' })
    @ApiResponse({ status: 404, description: 'Map not found' })
    async findOne(@Param('id') id: string): Promise<MapDocument> {
        return this.mapsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a map by ID' })
    @ApiParam({ name: 'id', description: 'Map ID' })
    @ApiResponse({ status: 200, description: 'Map updated successfully' })
    @ApiResponse({ status: 404, description: 'Map not found' })
    async update(@Param('id') id: string, @Body() updateMapDto: UpdateMapDto): Promise<MapDocument> {
        return this.mapsService.update(id, updateMapDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a map by ID' })
    @ApiParam({ name: 'id', description: 'Map ID' })
    @ApiResponse({ status: 200, description: 'Map deleted successfully' })
    @ApiResponse({ status: 404, description: 'Map not found' })
    async delete(@Param('id') id: string): Promise<MapDocument> {
        return this.mapsService.delete(id);
    }
}