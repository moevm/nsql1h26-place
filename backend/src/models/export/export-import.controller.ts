import { Controller, Get, Post, Body, BadRequestException, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ExportService } from './export.service';
import { ImportService } from './import.service';

@Controller('export-import')
export class ExportImportController {
  constructor(
    private readonly exportService: ExportService,
    private readonly importService: ImportService,
  ) {}

  @Get('export')
  async export(@Res() res: Response): Promise<void> {
    try {
      const data = await this.exportService.getAllData();
      const exportedContent = await this.exportService.exportToJSON(data);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `mushroom-place-export-${timestamp}.json`;

      res.setHeader('Content-Type', 'application/json');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`,
      );
      res.send(exportedContent);
    } catch (error) {
      throw new BadRequestException(`Export failed: ${error.message}`);
    }
  }

  @Post('import')
  async import(@Body() payload: { content: string }): Promise<{ message: string; success: boolean }> {
    if (!payload || !payload.content) {
      throw new BadRequestException('No content provided in request body');
    }

    try {
      await this.importService.importFromJSON(payload.content);
      return { message: 'Data imported successfully', success: true };
    } catch (error) {
      throw new BadRequestException(`Import failed: ${error.message}`);
    }
  }
}