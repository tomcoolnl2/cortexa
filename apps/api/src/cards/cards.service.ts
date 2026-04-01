import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CardsService {
    constructor(private readonly prisma: PrismaService) {}

    findAllByDeck(deckId: string) {
        return this.prisma.client.card.findMany({
            where: { deckId },
        });
    }

    create(deckId: string, dto: { term: string; definition: string }) {
        return this.prisma.client.card.create({
            data: { ...dto, deckId },
        });
    }

    update(id: string, dto: { term?: string; definition?: string }) {
        return this.prisma.client.card.update({
            where: { id },
            data: dto,
        });
    }

    remove(id: string) {
        return this.prisma.client.card.delete({
            where: { id },
        });
    }
}
