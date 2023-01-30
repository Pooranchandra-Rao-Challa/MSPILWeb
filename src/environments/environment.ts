

export const environment = {
  production: false,
  ApiUrl: 'https://localhost:7172/api/',
};
export const URI_ENDPOINT = (term:string) => `${environment.ApiUrl}${term}`;
export const URI_ENDPOINT_WITH_ID = (term:string,id: any) => `${environment.ApiUrl}${term}/${id}`;
