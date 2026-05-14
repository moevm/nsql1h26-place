import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import type { AuthUser } from 'src/auth/current-user.decorator';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { CreateObjectDto } from './dto/create-object.dto';
import { UpdateObjectDto } from './dto/update-object.dto';
import { ObjectDocument } from './schemas/objects.schema';
import { ObjectsService } from './objects.service';
import { ObjectType } from 'src/common/types/geojson.types';

@ApiTags('Objects')
@UseGuards(AuthGuard)
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
  @ApiOperation({ summary: 'Get objects of the current user' })
  @ApiResponse({ status: 200, description: 'List of objects' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (starts from 1)', example: 1 })
  async findAll(
    @CurrentUser() user: AuthUser,
    @Query('page') page?: string,
  ): Promise<ObjectDocument[]> {
    const pageNumber = Number.parseInt(page ?? '1', 10);
    return this.objectsService.findAll(
      user._id,
      Number.isFinite(pageNumber) && pageNumber > 0 ? pageNumber : 1,
    );
  }

  @Get('points')
  @ApiOperation({ summary: 'Get point objects of the current user' })
  @ApiResponse({ status: 200, description: 'List of point objects' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (starts from 1)', example: 1 })
  async findAllPoints(
    @CurrentUser() user: AuthUser,
    @Query('page') page?: string,
  ): Promise<ObjectDocument[]> {
    const pageNumber = Number.parseInt(page ?? '1', 10);
    return this.objectsService.findAllByType(
      user._id,
      ObjectType.POINT,
      Number.isFinite(pageNumber) && pageNumber > 0 ? pageNumber : 1,
    );
  }

  @Get('areas')
  @ApiOperation({ summary: 'Get area objects of the current user' })
  @ApiResponse({ status: 200, description: 'List of area objects' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (starts from 1)', example: 1 })
  async findAllAreas(
    @CurrentUser() user: AuthUser,
    @Query('page') page?: string,
  ): Promise<ObjectDocument[]> {
    const pageNumber = Number.parseInt(page ?? '1', 10);
    return this.objectsService.findAllByType(
      user._id,
      ObjectType.AREA,
      Number.isFinite(pageNumber) && pageNumber > 0 ? pageNumber : 1,
    );
  }

  @Get('routes')
  @ApiOperation({ summary: 'Get route objects of the current user' })
  @ApiResponse({ status: 200, description: 'List of route objects' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (starts from 1)', example: 1 })
  async findAllRoutes(
    @CurrentUser() user: AuthUser,
    @Query('page') page?: string,
  ): Promise<ObjectDocument[]> {
    const pageNumber = Number.parseInt(page ?? '1', 10);
    return this.objectsService.findAllByType(
      user._id,
      ObjectType.ROUTE,
      Number.isFinite(pageNumber) && pageNumber > 0 ? pageNumber : 1,
    );
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
  @ApiResponse({ status: 404, description: 'Map not found' })
  async delete(@Param('id') id: string): Promise<ObjectDocument> {
    return this.objectsService.delete(id);
  }
}
