import { Injectable, NotFoundException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeckDto, UpdateDeckDto } from '@cortexa/types';

@Injectable()
export class DecksService {
    constructor(private readonly prisma: PrismaService) {}

    findAll(userId: string) {
        if (!userId) {
            throw new UnauthorizedException('User not authenticated');
        }
        return this.prisma.client.deck.findMany({
            include: { cards: true },
        });
    }

    async findOne(id: string, userId: string) {
        if (!userId) {
            throw new UnauthorizedException('User not authenticated');
        }
        // First, check if the deck exists at all
        const deck = await this.prisma.client.deck.findUnique({
            where: { id },
            include: { cards: true },
        });
        if (!deck) {
            throw new NotFoundException(`Deck ${id} not found`);
        }
        return deck;
    }

    async create(userId: string, dto: CreateDeckDto) {
        if (!userId) {
            throw new UnauthorizedException('User not authenticated');
        }
        return this.prisma.client.deck.create({
            data: {
                title: dto.title,
                description: dto.description,
                userId,
                cards: {
                    create: dto.cards.map(c => ({
                        term: c.term,
                        definition: c.definition,
                    })),
                },
            },
            include: { cards: true },
        });
    }

    async update(id: string, userId: string, dto: UpdateDeckDto) {
        
        if (!userId) {
            throw new UnauthorizedException('User not authenticated');
        }
        
        await this.findOne(id, userId);

        // Destructure cards from dto and handle them separately
        const { cards, ...deckData } = dto as UpdateDeckDto;

        // Get current cards for the deck
        const currentDeck = await this.prisma.client.deck.findUnique({
            where: { id },
            include: { cards: true },
        });

        const currentCardIds = currentDeck?.cards.map(card => card.id) ?? [];
        const updatedCardIds = (cards ?? []).filter(card => card.id).map(card => card.id!);

        // Cards to delete: present in DB but not in the update
        const cardIdsToDelete = currentCardIds.filter(id => !updatedCardIds.includes(id));

        if (cardIdsToDelete.length > 0) {
            await this.prisma.client.card.deleteMany({
                where: {
                    id: { in: cardIdsToDelete },
                    deckId: id,
                },
            });
        }

        // Update existing cards and create new ones
        if (cards && cards.length > 0) {
            for (const card of cards) {
                if (card.id) {
                    // Update existing card
                    await this.prisma.client.card.update({
                        where: { id: card.id },
                        data: {
                            term: card.term,
                            definition: card.definition,
                        },
                    });
                } else {
                    // Create new card
                    await this.prisma.client.card.create({
                        data: {
                            term: card.term,
                            definition: card.definition,
                            deckId: id,
                        },
                    });
                }
            }
        }

        // Update deck data (title, description, etc.)
        return this.prisma.client.deck.update({
            where: { id },
            data: {
                ...deckData,
            },
            include: { cards: true },
        });
    }

    async remove(id: string, userId: string) {
        await this.findOne(id, userId);

        return this.prisma.client.deck.delete({
            where: { id },
        });
    }
}
