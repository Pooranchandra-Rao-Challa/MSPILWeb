export const environment = {
  production: true,
  ApiUrl: 'http://localhost:4345/',
};
export const URI_ENDPOINT = (term:string) => `${environment.ApiUrl}${term}`;

export const URI_ENDPOINT_WITH_ID = (term:string,id: any) => `${environment.ApiUrl}${term}/${id}`;
