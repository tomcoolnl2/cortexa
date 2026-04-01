import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeckDto, UpdateDeckDto } from '@cortexa/types';

@Injectable()
export class DecksService {
    constructor(private readonly prisma: PrismaService) {}

    findAll() {
        return this.prisma.client.deck.findMany({
            include: { cards: true },
        });
    }

    findOne(id: string) {
        return this.prisma.client.deck.findUniqueOrThrow({
            where: { id },
            include: { cards: true },
        });
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

    update(id: string, dto: UpdateDeckDto) {
        return this.prisma.client.deck.update({
            where: { id },
            data: dto,
            include: { cards: true },
        });
    }

    remove(id: string) {
        return this.prisma.client.deck.delete({
            where: { id },
        });
    }
}
