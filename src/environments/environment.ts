

export const environment = {
  production: false,
  ApiUrl: 'https://localhost:7172/api/',
};
export const URI_ENDPOINT = (term:string) => `${environment.ApiUrl}${term}`;
export const URI_ENDPOINT_WITH_ID = (term:string,id: any) => `${environment.ApiUrl}${term}/${id}`;

export const URI_ENDPOINT_WITH_PARAMS = (term:string,params: any[]) => `${environment.ApiUrl}${term}${convertParamsToUrlString(params)}`;
export const URI_PARAM_APPENDER = (param: any) => `/${param}`;
function convertParamsToUrlString(params:any[]):any{
  let str = '';
  params.forEach((param)=>
    str += URI_PARAM_APPENDER(param)
  )
  return str;
}

export enum EDocumentNumberScreens{
  Plots = 1,
  Samples = 2,
  Permits = 3,
  Loans = 4,
  PlotTransfers = 5,
  Seed = 6,
  CompletedPlots = 7
}

export const CURRENT_SEASON = () => { return  (new Date().getMonth() >= 10 ) ? `${new Date().getFullYear()}-${(new Date().getFullYear()+1).toString().substring(2,4)}` : `${new Date().getFullYear()-1}-${(new Date().getFullYear()).toString().substring(2,4)}`}
