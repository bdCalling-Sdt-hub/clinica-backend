export type TNotification ={
    type:"connection" | "glucose" | "bloodPressure" | "weight" | "message";
    title?:string;
    message:string;
    isRead:boolean;
    link?:string;
}