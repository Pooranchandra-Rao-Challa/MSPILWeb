export const environment = {
  production: false,
  ApiUrl: 'http://182.18.157.215/MSPIL/API/api/',
};
export const URI_ENDPOINT = (term:string) => `${environment.ApiUrl}${term}`;

export const URI_ENDPOINT_WITH_ID = (term:string,id: any) => `${environment.ApiUrl}${term}/${id}`;

export const URI_ENDPOINT_WITH_IDANDPARAM1 = (term:string,id: any,param1:string) => `${environment.ApiUrl}${term}/${id}/${param1}`;

export const URI_ENDPOINT_WITH_PARAM = (term:string,param: any) => `${environment.ApiUrl}${term}/${param}`;
