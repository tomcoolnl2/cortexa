import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
} from '@nestjs/common';
import { CardsService } from './cards.service';

@Controller('decks/:deckId/cards')
export class CardsController {
    constructor(private readonly cardsService: CardsService) {}

    @Get()
    findAll(@Param('deckId') deckId: string) {
        return this.cardsService.findAllByDeck(deckId);
    }

    @Post()
    create(
        @Param('deckId') deckId: string,
        @Body() dto: { term: string; definition: string }
    ) {
        return this.cardsService.create(deckId, dto);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() dto: { term?: string; definition?: string }
    ) {
        return this.cardsService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.cardsService.remove(id);
    }
}
