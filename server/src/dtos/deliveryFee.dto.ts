export interface CreateDeliveryFeeDto {
    regionName:string,
    feeAmount:number,
    minOrderValue:number
    status?:boolean
}
