export interface IDevice {
    Id: number;
    DeviceName: string;
    Status: string;
    ItemType: string;
    PlatformName: string;
    PlatformVersion: string;
    RamSize: string;
    ScreenSize: string;
    StorageSize: string;
    InventoryNumber: string;
    SerialNumber: string;
    Comments?: string;
    Owner: string;
    Keeper: string;
    Project: string;
    Origin: string;
    KeeperNumber: number;
    BookingDate?: string;
    ReturnDate?: string;
  }