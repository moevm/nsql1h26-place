import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateObjectDto } from './dto/create-object.dto';
import { UpdateObjectDto } from './dto/update-object.dto';
import { ObjectDocument } from './schemas/objects.schema';
import { ObjectsService } from './objects.service';
import { ObjectType } from 'src/common/types/geojson.types';

@ApiTags('Objects')
@Controller('/objects')
export class ObjectsController {
  constructor(private readonly objectsService: ObjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new object' })
  @ApiResponse({ status: 201, description: 'Object created successfully' })
  async create(@Body() createObjectDto: CreateObjectDto): Promise<ObjectDocument> {
    return this.objectsService.create(createObjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all objects' })
  @ApiResponse({ status: 200, description: 'List of all objects' })
  async findAll(): Promise<ObjectDocument[]> {
    return this.objectsService.findAll();
  }

  @Get('points')
  @ApiOperation({ summary: 'Get all point objects' })
  @ApiResponse({ status: 200, description: 'List of point objects' })
  async findAllPoints(): Promise<ObjectDocument[]> {
    return this.objectsService.findAllByType(ObjectType.POINT);
  }

  @Get('areas')
  @ApiOperation({ summary: 'Get all area objects' })
  @ApiResponse({ status: 200, description: 'List of area objects' })
  async findAllAreas(): Promise<ObjectDocument[]> {
    return this.objectsService.findAllByType(ObjectType.AREA);
  }

  @Get('routes')
  @ApiOperation({ summary: 'Get all route objects' })
  @ApiResponse({ status: 200, description: 'List of route objects' })
  async findAllRoutes(): Promise<ObjectDocument[]> {
    return this.objectsService.findAllByType(ObjectType.ROUTE);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an object by ID' })
  @ApiParam({ name: 'id', description: 'Object ID' })
  @ApiResponse({ status: 200, description: 'Object found' })
  @ApiResponse({ status: 404, description: 'Object not found' })
  async findOne(@Param('id') id: string): Promise<ObjectDocument> {
    return this.objectsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an object by ID' })
  @ApiParam({ name: 'id', description: 'Object ID' })
  @ApiResponse({ status: 200, description: 'Object updated successfully' })
  @ApiResponse({ status: 404, description: 'Object not found' })
  async update(@Param('id') id: string, @Body() updateObjectDto: UpdateObjectDto): Promise<ObjectDocument> {
    return this.objectsService.update(id, updateObjectDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an object by ID' })
  @ApiParam({ name: 'id', description: 'Object ID' })
  @ApiResponse({ status: 200, description: 'Object deleted successfully' })
  @ApiResponse({ status: 404, description: 'Object not found' })
  async delete(@Param('id') id: string): Promise<ObjectDocument> {
    return this.objectsService.delete(id);
  }
}