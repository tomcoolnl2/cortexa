import { Injectable, NotFoundException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeckDto, UpdateDeckDto } from '@cortexa/models';

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
        await this.findOne(id, userId);

        // Destructure cards from dto and handle them separately
        const { cards, ...deckData } = dto as UpdateDeckDto;

        return this.prisma.client.deck.update({
            where: { id },
            data: {
                ...deckData,
                ...(cards && {
                    cards: {
                        set: cards
                            .filter(card => card.id) // Only include cards with a valid id
                            .map(card => ({ id: card.id! }))
                    }
                }),
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
