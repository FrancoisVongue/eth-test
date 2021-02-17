import { Module } from '@nestjs/common';
import { PoolEventsService } from './pool-events.service';
import {MongooseModule} from "@nestjs/mongoose";
import {PoolEvent, PoolEventSchema} from "./pool-events.schema";
import {ConfigModule} from "@nestjs/config";
import PoolEventsConfig from './config/pool-events.config'
import {Web3Module} from "../web3/web3.module";
import {PoolEventsRepository} from "./pool-events.repository";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: PoolEvent.name,
                schema: PoolEventSchema,
            }
        ]),
        ConfigModule.forFeature(PoolEventsConfig),
        Web3Module,
    ],
    providers: [PoolEventsService, PoolEventsRepository],
    exports: [],
})
export class PoolEventsModule {}
