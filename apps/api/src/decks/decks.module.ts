import { Module } from '@nestjs/common';
import { DecksController, PublicDecksController } from './decks.controller';
import { DecksService } from './decks.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [PublicDecksController, DecksController],
    providers: [DecksService],
})
export class DecksModule {}
