import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { AuthGuard } from "src/auth/auth.guard";
import type { AuthUser } from "src/auth/current-user.decorator";
import { CurrentUser } from "src/auth/current-user.decorator";
import { MapsService } from "./maps.service";
import { MapDocument } from "./schemas/maps.schema";
import { CreateMapDto } from "./dto/create-map.dto";
import { UpdateMapDto } from "./dto/update-map.dto";

@ApiTags('Maps')
@UseGuards(AuthGuard)
@Controller("/maps")
export class MapsController {
    constructor(private readonly mapsService: MapsService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new map' })
    @ApiResponse({ status: 201, description: 'Map created successfully' })
    async create(
        @CurrentUser() user: AuthUser,
        @Body() createMapDto: CreateMapDto,
    ): Promise<MapDocument> {
        return this.mapsService.create(createMapDto, user._id);
    }

    @Get()
    @ApiOperation({ summary: 'Get maps of the current user' })
    @ApiResponse({ status: 200, description: 'List of maps' })
    @ApiQuery({ name: 'page', required: false, description: 'Page number (starts from 1)', example: 1 })
    async findAll(
        @CurrentUser() user: AuthUser,
        @Query('page') page?: string,
    ): Promise<MapDocument[]> {
        const pageNumber = Number.parseInt(page ?? '1', 10);
        return this.mapsService.findAll(
            user._id,
            Number.isFinite(pageNumber) && pageNumber > 0 ? pageNumber : 1,
        );
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
