export class LookUpHeaderDto{
  lookupHeaderId?:number
  code?: string
  name?: string
  details?:LookupDetailDto[]
}
export class LookupDetailDto{
  lookupDetailId?:number
  lokkupDetailHeaderId?:string
  code?: string
  name?: string
  remarks?:string
  order?: number
}
