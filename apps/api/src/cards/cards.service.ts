import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CardsService {
    constructor(private readonly prisma: PrismaService) {}

    async findAllByDeck(deckId: string, userId: string) {
        await this.prisma.client.deck.findFirstOrThrow({
            where: { id: deckId, userId },
        });

        return this.prisma.client.card.findMany({
            where: { deckId },
        });
    }

    async create(
        deckId: string,
        userId: string,
        dto: { term: string; definition: string },
    ) {
        await this.prisma.client.deck.findFirstOrThrow({
            where: { id: deckId, userId },
        });

        return this.prisma.client.card.create({
            data: { ...dto, deckId },
        });
    }

    async update(
        id: string,
        userId: string,
        dto: { term?: string; definition?: string },
    ) {
        await this.prisma.client.card.findFirstOrThrow({
            where: { id, deck: { userId } },
        });

        return this.prisma.client.card.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string, userId: string) {
        await this.prisma.client.card.findFirstOrThrow({
            where: { id, deck: { userId } },
        });

        return this.prisma.client.card.delete({
            where: { id },
        });
    }
}
