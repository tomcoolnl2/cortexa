import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { DecksModule } from '../decks/decks.module';
import { CardsModule } from '../cards/cards.module';

@Module({
    imports: [PrismaModule, DecksModule, CardsModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
