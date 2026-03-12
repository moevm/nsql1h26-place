import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { PointDocument } from './schemas/points.schema';
import { PointsService } from './points.service';

@ApiTags('Points')
@Controller('/points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new point' })
  @ApiResponse({ status: 201, description: 'Point created successfully' })
  async create(@Body() createPointDto: CreatePointDto): Promise<PointDocument> {
    return this.pointsService.create(createPointDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all points' })
  @ApiResponse({ status: 200, description: 'List of all points' })
  async findAll(): Promise<PointDocument[]> {
    return this.pointsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a point by ID' })
  @ApiParam({ name: 'id', description: 'Point ID' })
  @ApiResponse({ status: 200, description: 'Point found' })
  @ApiResponse({ status: 404, description: 'Point not found' })
  async findOne(@Param('id') id: string): Promise<PointDocument> {
    return this.pointsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a point by ID' })
  @ApiParam({ name: 'id', description: 'Point ID' })
  @ApiResponse({ status: 200, description: 'Point updated successfully' })
  @ApiResponse({ status: 404, description: 'Point not found' })
  async update(@Param('id') id: string, @Body() updatePointDto: UpdatePointDto): Promise<PointDocument> {
    return this.pointsService.update(id, updatePointDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a point by ID' })
  @ApiParam({ name: 'id', description: 'Point ID' })
  @ApiResponse({ status: 200, description: 'Point deleted successfully' })
  @ApiResponse({ status: 404, description: 'Point not found' })
  async delete(@Param('id') id: string): Promise<PointDocument> {
    return this.pointsService.delete(id);
  }
}