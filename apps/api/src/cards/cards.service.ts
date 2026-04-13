import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { UserRole } from '@cortexa/types';

@Injectable()
export class CardsService {
    
    constructor(private readonly prisma: PrismaService) {}

    // Checks if the user is allowed to access/modify the deck or card
    private async checkDeckPermission(deckId: string, userId: string, userRole: UserRole) {
        const deck = await this.prisma.client.deck.findUnique({ where: { id: deckId } });
        if (!deck) {
            throw new NotFoundException('Deck not found');
        }
        if (userRole === 'admin' || userRole === 'creator') {
            return deck;
        }
        if (deck.userId !== userId) {
            throw new ForbiddenException('You do not have permission to access this deck');
        }
        return deck;
    }

    private async checkCardPermission(cardId: string, userId: string, userRole: UserRole) {
        const card = await this.prisma.client.card.findUnique({ where: { id: cardId }, include: { deck: true } });
        if (!card) {
            throw new NotFoundException('Card not found');
        }
        if (userRole === 'admin' || userRole === 'creator') {
            return card;
        }
        if (!card.deck || card.deck.userId !== userId) {
            throw new ForbiddenException('You do not have permission to access this card');
        }
        return card;
    }

    async findAllByDeck(deckId: string, userId: string, userRole: UserRole) {
        await this.checkDeckPermission(deckId, userId, userRole);
        return this.prisma.client.card.findMany({ where: { deckId } });
    }

    async create(
        deckId: string,
        userId: string,
        userRole: UserRole,
        dto: { term: string; definition: string },
    ) {
        await this.checkDeckPermission(deckId, userId, userRole);
        return this.prisma.client.card.create({
            data: { ...dto, deckId },
        });
    }

    async update(
        id: string,
        userId: string,
        userRole: UserRole,
        dto: { term?: string; definition?: string },
    ) {
        await this.checkCardPermission(id, userId, userRole);
        return this.prisma.client.card.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string, userId: string, userRole: UserRole) {
        await this.checkCardPermission(id, userId, userRole);
        return this.prisma.client.card.delete({
            where: { id },
        });
    }
}
