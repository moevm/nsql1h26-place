import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { Route } from './schemas/routes.schema';
import { RoutesService } from './routes.service';

@ApiTags('Routes')
@Controller('/routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new route' })
  @ApiResponse({ status: 201, description: 'Route created successfully' })
  async create(@Body() createRouteDto: CreateRouteDto) {
    return this.routesService.create(createRouteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all routes' })
  @ApiResponse({ status: 200, description: 'List of all routes' })
  async findAll(): Promise<Route[]> {
    return this.routesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a route by ID' })
  @ApiParam({ name: 'id', description: 'Route ID' })
  @ApiResponse({ status: 200, description: 'Route found' })
  @ApiResponse({ status: 404, description: 'Route not found' })
  async findOne(@Param('id') id: string) {
    return this.routesService.findOne(id);
  }

  @Post(':id')
  @ApiOperation({ summary: 'Update a route by ID' })
  @ApiParam({ name: 'id', description: 'Route ID' })
  @ApiResponse({ status: 200, description: 'Route updated successfully' })
  @ApiResponse({ status: 404, description: 'Route not found' })
  async update(@Param('id') id: string, @Body() updateRouteDto: UpdateRouteDto) {
    return this.routesService.update(id, updateRouteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a route by ID' })
  @ApiParam({ name: 'id', description: 'Route ID' })
  @ApiResponse({ status: 200, description: 'Route deleted successfully' })
  @ApiResponse({ status: 404, description: 'Route not found' })
  async delete(@Param('id') id: string) {
    return this.routesService.delete(id);
  }
}
