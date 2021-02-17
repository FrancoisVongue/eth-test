import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {PoolEvent, PoolEventDocument} from "./pool-events.schema";
import {Model} from "mongoose";
import {Web3EventTypes} from "../web3/web3.service";

@Injectable()
export class PoolEventsRepository {
    constructor(
        @InjectModel(PoolEvent.name)
        private readonly poolEventModel: Model<PoolEventDocument>,
    ) {}

    async storeEvents(events: PoolEvent[]): Promise<number> {
        const insertionResult = await this.poolEventModel.insertMany(
            events,
            {
                lean: true,
                rawResult: true
            }
        );

        return insertionResult.insertedCount ?? 0;
    }

    async getLatestBlock(
        eventType: Web3EventTypes = 'allEvents'
    ): Promise<number> {
        const latestBlock = (await this.poolEventModel
            .findOne({
                event: eventType !== "allEvents"
                    ? eventType
                    : undefined,
            })
            .sort({blockNumber: -1}))?.blockNumber ?? 0;

        return latestBlock;
    }
}
