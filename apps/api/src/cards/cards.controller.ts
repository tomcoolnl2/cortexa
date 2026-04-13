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
import { CardsService } from './cards.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthenticatedRequestUser } from '../auth/auth.types';

@Controller('decks/:deckId/cards')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CardsController {
    
    constructor(private readonly cardsService: CardsService) {}

    @Get()
    @Roles('admin', 'creator', 'reader')
    findAll(
        @Param('deckId') deckId: string,
        @CurrentUser() user: AuthenticatedRequestUser,
    ) {
        return this.cardsService.findAllByDeck(deckId, user.userId, user.role);
    }

    @Post()
    @Roles('admin', 'creator')
    create(
        @Param('deckId') deckId: string,
        @Body() dto: { term: string; definition: string },
        @CurrentUser() user: AuthenticatedRequestUser,
    ) {
    	return this.cardsService.create(deckId, user.userId, user.role, dto);
    }

    @Patch(':id')
    @Roles('admin', 'creator')
    update(
        @Param('id') id: string,
        @Body() dto: { term?: string; definition?: string },
        @CurrentUser() user: AuthenticatedRequestUser,
    ) {
    	return this.cardsService.update(id, user.userId, user.role, dto);
    }

    @Delete(':id')
    @Roles('admin', 'creator')
    remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedRequestUser) {
        console.warn(`Attempting to remove card with id ${id} for user ${user.userId}`);
    	return this.cardsService.remove(id, user.userId, user.role);
    }
}
