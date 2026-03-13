import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SupportTicket {
    id: bigint;
    status: TicketStatus;
    adminReply?: string;
    subject: string;
    userId: Principal;
    message: string;
    timestamp: Time;
}
export type Time = bigint;
export interface FundRequest {
    id: bigint;
    status: FundRequestStatus;
    screenshotBlobId: string;
    userId: Principal;
    timestamp: Time;
    amount: number;
}
export interface Service {
    id: bigint;
    pricePerThousand: number;
    serviceType: string;
    maxQuantity: bigint;
    name: string;
    isActive: boolean;
    apiServiceId: string;
    category: string;
    minQuantity: bigint;
}
export interface Order {
    id: bigint;
    status: OrderStatus;
    userId: Principal;
    link: string;
    timestamp: Time;
    quantity: bigint;
    serviceId: bigint;
    totalPrice: number;
    apiOrderId?: string;
}
export interface UserProfile {
    name: string;
    email: string;
}
export enum FundRequestStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum OrderStatus {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    processing = "processing"
}
export enum TicketStatus {
    closed = "closed",
    open = "open"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addService(name: string, category: string, serviceType: string, pricePerThousand: number, minQuantity: bigint, maxQuantity: bigint, apiServiceId: string): Promise<void>;
    approveFundRequest(requestId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createSupportTicket(subject: string, message: string): Promise<void>;
    getBalance(): Promise<number>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPendingFundRequests(): Promise<Array<FundRequest>>;
    getServices(): Promise<Array<Service>>;
    getUserOrders(userId: Principal): Promise<Array<Order>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserTickets(userId: Principal): Promise<Array<SupportTicket>>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(serviceId: bigint, link: string, quantity: bigint): Promise<void>;
    rejectFundRequest(requestId: bigint): Promise<void>;
    replyToTicket(ticketId: bigint, reply: string): Promise<void>;
    requestFunds(amount: number, screenshotBlobId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
