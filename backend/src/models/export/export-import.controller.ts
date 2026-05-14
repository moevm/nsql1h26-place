import { Controller, Get, Post, Body, BadRequestException, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import type { AuthUser } from 'src/auth/current-user.decorator';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { ExportService } from './export.service';
import { ImportService } from './import.service';

@ApiTags('Export/Import')
@UseGuards(AuthGuard)
@Controller('export-import')
export class ExportImportController {
  constructor(
    private readonly exportService: ExportService,
    private readonly importService: ImportService,
  ) {}

  @Get('export')
  @ApiOperation({ summary: 'Export current user data as JSON file' })
  @ApiResponse({ status: 200, description: 'JSON file with user data' })
  async export(
    @CurrentUser() user: AuthUser,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const content = await this.exportService.exportForUser(user._id);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `mushroom-place-export-${timestamp}.json`;

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(content);
    } catch (error) {
      throw new BadRequestException(`Ошибка экспорта: ${error.message}`);
    }
  }

  @Post('import')
  @ApiOperation({ summary: 'Import user data from JSON (replaces current user data only)' })
  @ApiResponse({ status: 200, description: 'Import successful' })
  async import(
    @CurrentUser() user: AuthUser,
    @Body() payload: { content: string },
  ): Promise<{ message: string; success: boolean }> {
    if (!payload?.content) {
      throw new BadRequestException('Содержимое файла не передано');
    }

    await this.importService.importFromJSON(payload.content, user._id);
    return { message: 'Данные успешно импортированы', success: true };
  }
}
