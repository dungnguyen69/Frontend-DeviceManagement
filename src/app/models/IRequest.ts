export interface IRequest {
    Id: number;
    currentKeeper: string;
    nextKeeper: string;
    bookingDate?: string;
    returnDate?: string;
    deviceId: number;
    itemType: string;
    deviceName: string;
    platformName: string;
    platformVersion: string;
    ramSize: string;
    screenSize: string;
    storageSize: string;
    inventoryNumber: string;
    serialNumber: string;
    ticketId: string;
    requester: string;
}