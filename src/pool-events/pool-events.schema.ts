import {Document} from "mongoose";
import {Prop, Schema, SchemaFactory, raw} from "@nestjs/mongoose";

export type PoolEventDocument = PoolEvent & Document;

@Schema()
export class PoolEvent {
    @Prop()
    address: string;

    @Prop()
    blockHash: string;

    @Prop()
    blockNumber: number;

    @Prop()
    logIndex: number;

    @Prop()
    removed: boolean;

    @Prop()
    transactionHash: string;

    @Prop()
    transactionIndex: number;

    @Prop({
        unique: true,
        sparse: true,
        type: String,
    })
    id: string;

    @Prop({type: Object})
    returnValues: Record<string, any>;

    @Prop()
    event: string;

    @Prop()
    signature: string;

    @Prop(raw({
        data: {type: String},
        topics: {type: Array},
    }))
    raw: {data: string, topics: any[]};
}
export const PoolEventSchema = SchemaFactory.createForClass(PoolEvent);
