

export const environment = {
  production: false,
  ApiUrl: 'http://localhost:4345/api',
};
export const URI_ENDPOINT = (term:string) => `${environment.ApiUrl}${term}`;
