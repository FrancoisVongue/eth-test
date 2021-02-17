import {Injectable} from "@nestjs/common";
import * as Web3 from "web3"
import {ConfigService} from "@nestjs/config";
import {GlobalConfig} from "../config";

@Injectable()
export class Web3Service {
    private readonly web3;

    constructor(
        private readonly configService: ConfigService<GlobalConfig>,
    ) {
        this.web3 = new (Web3 as any)(this.configService.get('MAINNET_URL'));
    }

    GetContract(contractAbi, contractId) {
        return new this.web3.eth.Contract(contractAbi, contractId);
    }

    async GetContractEvents(
        contract,
        eventType: `allEvents` | 'mint' | 'burn' | 'swap' | 'sync' = "allEvents",
        from: number | 'earliest' = 0,
        to: number | 'latest' = 'latest'
    ) {
        const events = await contract.getPastEvents(eventType, {
            fromBlock: from,
            toBlock: to,
        });
        return events;
    }
}
