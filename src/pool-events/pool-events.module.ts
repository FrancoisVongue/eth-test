import { Module } from '@nestjs/common';
import { PoolEventsService } from './pool-events.service';
import {MongooseModule} from "@nestjs/mongoose";
import {PoolEvent, PoolEventSchema} from "./pool-events.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: PoolEvent.name,
                schema: PoolEventSchema,
            }
        ])
    ],
    providers: [PoolEventsService],
    exports: [],
})
export class PoolEventsModule {}
