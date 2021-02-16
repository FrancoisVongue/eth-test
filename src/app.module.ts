import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { PoolEventsModule } from './pool-events/pool-events.module';
import {ScheduleModule} from "@nestjs/schedule";

@Module({
    imports: [
        MongooseModule.forRoot(`mongodb://localhost:27017/ethereum`, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
        }),
        ScheduleModule.forRoot(),
        PoolEventsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
