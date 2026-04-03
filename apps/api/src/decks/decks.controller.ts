import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    UseGuards,
} from '@nestjs/common';
import { DecksService } from './decks.service';
import { CreateDeckDto, UpdateDeckDto } from '@cortexa/models';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthenticatedRequestUser } from '../auth/auth.types';

/**
 * All routes are relative to the global prefix "api",
 * so these become /api/decks, /api/decks/:id, etc.
 */
@Controller('decks/public')
export class PublicDecksController {
    constructor(private readonly decksService: DecksService) {}

    @Get()
    findAllPublic() {
        return this.decksService.findAllPublic();
    }

    @Get(':id')
    findOnePublic(@Param('id') id: string) {
    	return this.decksService.findOnePublic(id);
    }
}

@Controller('decks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DecksController {
    constructor(private readonly decksService: DecksService) {}

    @Get()
    @Roles('admin', 'creator', 'reader')
    findAll(@CurrentUser() user: AuthenticatedRequestUser) {
        return this.decksService.findAll(user.userId);
    }

    @Get(':id')
    @Roles('admin', 'creator', 'reader')
    findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedRequestUser) {
    	return this.decksService.findOne(id, user.userId);
    }

    @Post()
    @Roles('admin', 'creator')
    create(@Body() dto: CreateDeckDto, @CurrentUser() user: AuthenticatedRequestUser) {
    	return this.decksService.create(user.userId, dto);
    }

    @Patch(':id')
    @Roles('admin', 'creator')
    update(
        @Param('id') id: string,
        @Body() dto: UpdateDeckDto,
        @CurrentUser() user: AuthenticatedRequestUser,
    ) {
    	return this.decksService.update(id, user.userId, dto);
    }

    @Delete(':id')
    @Roles('admin', 'creator')
    remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedRequestUser) {
    	return this.decksService.remove(id, user.userId);
    }
}
