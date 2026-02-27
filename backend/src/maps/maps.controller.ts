import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { MapsService } from "./maps.service";
import { Map } from "./schemas/maps.schema";
import { CreateMapDto } from "./dto/create-map.dto";
import { UpdateMapDto } from "./dto/update-map.dto";

@Controller("/maps")
export class MapsController {
    constructor(private readonly mapsService: MapsService) {}

    @Post()
    async create(@Body() createMapDto: CreateMapDto) {
        return this.mapsService.create(createMapDto);
    }

    @Get()
    async findAll(): Promise<Map[]> {
        return this.mapsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.mapsService.findOne(id);
    }

    @Post(':id')
    async update(@Param('id') id: string, @Body() updateMapDto: UpdateMapDto) {
        return this.mapsService.update(id, updateMapDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.mapsService.delete(id);
    }
}