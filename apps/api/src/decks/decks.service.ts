import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeckDto, UpdateDeckDto } from '@cortexa/types';

@Injectable()
export class DecksService {
    constructor(private readonly prisma: PrismaService) {}

    findAll(userId: string) {
        return this.prisma.client.deck.findMany({
            where: { userId },
            include: { cards: true },
        });
    }

    findAllPublic() {
        return this.prisma.client.deck.findMany({
            include: { cards: true },
        });
    }

    async findOnePublic(id: string) {
        const deck = await this.prisma.client.deck.findUnique({
            where: { id },
            include: { cards: true },
        });
        if (!deck) {
            throw new NotFoundException(`Deck ${id} not found`);
        }
        return deck;
    }

    async findOne(id: string, userId: string) {
        const deck = await this.prisma.client.deck.findFirst({
            where: { id, userId },
            include: { cards: true },
        });
        if (!deck) {
            throw new NotFoundException(`Deck ${id} not found`);
        }
        return deck;
    }

    create(userId: string, dto: CreateDeckDto) {
        return this.prisma.client.deck.create({
            data: {
                title: dto.title,
                description: dto.description,
                userId,
                cards: {
                    create: dto.cards,
                },
            },
            include: { cards: true },
        });
    }

    async update(id: string, userId: string, dto: UpdateDeckDto) {
        await this.findOne(id, userId);

        return this.prisma.client.deck.update({
            where: { id },
            data: dto,
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
