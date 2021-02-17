import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { PoolEventsModule } from './pool-events/pool-events.module';
import {ScheduleModule} from "@nestjs/schedule";
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [
        MongooseModule.forRoot(`mongodb://localhost:27017/ethereum`, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            expandVariables: true,
        }),
        ScheduleModule.forRoot(),
        PoolEventsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
