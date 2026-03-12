import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { AreaDocument } from './schemas/areas.schema';

@ApiTags('Areas')
@Controller('/areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new area' })
  @ApiResponse({ status: 201, description: 'Area created successfully' })
  async create(@Body() createAreaDto: CreateAreaDto): Promise<AreaDocument> {
    return this.areasService.create(createAreaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all areas' })
  @ApiResponse({ status: 200, description: 'List of all areas' })
  async findAll(): Promise<AreaDocument[]> {
    return this.areasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an area by ID' })
  @ApiParam({ name: 'id', description: 'Area ID' })
  @ApiResponse({ status: 200, description: 'Area found' })
  @ApiResponse({ status: 404, description: 'Area not found' })
  async findOne(@Param('id') id: string): Promise<AreaDocument> {
    return this.areasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an area by ID' })
  @ApiParam({ name: 'id', description: 'Area ID' })
  @ApiResponse({ status: 200, description: 'Area updated successfully' })
  @ApiResponse({ status: 404, description: 'Area not found' })
  async update(@Param('id') id: string, @Body() updateAreaDto: UpdateAreaDto): Promise<AreaDocument> {
    return this.areasService.update(id, updateAreaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an area by ID' })
  @ApiParam({ name: 'id', description: 'Area ID' })
  @ApiResponse({ status: 200, description: 'Area deleted successfully' })
  @ApiResponse({ status: 404, description: 'Area not found' })
  async delete(@Param('id') id: string): Promise<AreaDocument> {
    return this.areasService.delete(id);
  }
}