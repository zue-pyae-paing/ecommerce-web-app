export interface GetAllPaymentDto {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    order?: "asc" | "desc";
}

export interface GetAllUserPaymentDto {
    userId?: string;
    cursor?: string;
    limit?: number;
    search?: string;
    sort?: string;
    order?: "asc" | "desc";
}

export interface CreatePaymentDto {
    orderId: string;
    transactionId: string;
    method : "KBZ_PAY"|"AYA_PAY" |"WAVE_PAY";
    senderPhone: string;
}