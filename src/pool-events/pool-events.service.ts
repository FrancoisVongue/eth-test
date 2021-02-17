import {Injectable, OnModuleInit} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {PoolEvent, PoolEventDocument} from "./pool-events.schema";
import {Model} from "mongoose";
import {Cron} from "@nestjs/schedule";
import {Web3Service} from "../web3/web3.service";
import {ConfigService} from "@nestjs/config";
import {GlobalConfig} from "../config";
import {PoolEventsConfig} from "./config/pool-events.config";

@Injectable()
export class PoolEventsService implements OnModuleInit {
    private contract;
    private FETCH_BLOCK_RANGE;

    constructor(
        @InjectModel(PoolEvent.name)
        private readonly poolEventModel: Model<PoolEventDocument>,

        private readonly web3service: Web3Service,
        private readonly configService: ConfigService<GlobalConfig & PoolEventsConfig>,
    ) {}

    onModuleInit() {
        const contractAbi = this.configService.get<any[]>('CONTRACT_ABI');
        const contractId = this.configService.get<string>('POOL_ID');
        this.contract = this.web3service.GetContract(contractAbi, contractId);

        this.FETCH_BLOCK_RANGE = this.configService.get<number>('FETCH_BLOCK_RANGE');
    }

    async fetchNextEvents(
        latestBlock: number,
    ): Promise<PoolEvent[]> {
        const prevFetchBlockRangeEnd = Math.ceil(
            latestBlock / this.FETCH_BLOCK_RANGE
        ) * this.FETCH_BLOCK_RANGE - 1;
        const currentFetchBlockRangeStart = prevFetchBlockRangeEnd + 1;
        const currentFetchBlockRangeEnd = prevFetchBlockRangeEnd + this.FETCH_BLOCK_RANGE;

        console.log(`Fetching range: ${currentFetchBlockRangeStart} ` +
            `-> ${currentFetchBlockRangeEnd}`);

        const events = await this.web3service.GetContractEvents(
            this.contract,
            "allEvents",
            currentFetchBlockRangeStart,
            currentFetchBlockRangeEnd,
        );

        console.log(`Found ${events.length} events`);

        return events;
    }

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

    async storeNewEvents() {
        const latestBlock = (await this.poolEventModel
            .findOne()
            .sort({blockNumber: -1}))?.blockNumber ?? 0;

        const newEvents = await this.fetchNextEvents(latestBlock);
        if(!newEvents.length) {
            console.log(`Creating filler event...`);
            newEvents.push({blockNumber: latestBlock + this.FETCH_BLOCK_RANGE} as any);
        }
        const insertedCount = await this.storeEvents(newEvents);

        console.log(`Successfully inserted ${insertedCount} events.`);
    }

    @Cron(`*/15 * * * * *`) // every 15 seconds
    async storeNewEventsCron() {
        await this.storeNewEvents();
    }
}
