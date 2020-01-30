export class EventDispatcher {
    type:EventType;
    eventData:string;
}

export enum EventType {
    DblClick, MouseDown, MouseUp
}
