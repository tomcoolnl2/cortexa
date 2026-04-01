import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
} from '@nestjs/common';
import { DecksService } from './decks.service';
import { CreateDeckDto, UpdateDeckDto } from '@cortexa/types';

/**
 * All routes are relative to the global prefix "api",
 * so these become /api/decks, /api/decks/:id, etc.
 */
@Controller('decks')
export class DecksController {
    constructor(private readonly decksService: DecksService) {}

    @Get()
    findAll() {
        return this.decksService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.decksService.findOne(id);
    }

    /** Hard-coded userId for now — auth comes later. */
    @Post()
    create(@Body() dto: CreateDeckDto) {
        const userId = 'demo-user-id';
        return this.decksService.create(userId, dto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateDeckDto) {
        return this.decksService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.decksService.remove(id);
    }
}
