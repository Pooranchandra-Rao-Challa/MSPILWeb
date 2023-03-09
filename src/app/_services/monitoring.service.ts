import { Injectable } from "@angular/core";
import { AllottedPlotDto, IAllottedPlotViewDto, WeedicideDto } from "src/app/_models/monitoring";
import { ApiHttpService } from "./api.http.service";
import { CREATE_ALLOTTEDPLOT_URI, GET_ALLOTTEDPLOTS_URI, GET_OFFERCODE_URI, UPDATE_ALLOTTEDPLOT_URI,IS_NEW_FARMAR_URI, LOOKUP_WEEDS_URI } from "./api.uri.service";

@Injectable({ providedIn: 'root' })
export class MonitoringService extends ApiHttpService {
  // Get new offerNo
  public GetNewOfferNo(seasonId: number) {
    return this.get<any>(GET_OFFERCODE_URI + seasonId);
  }

  public CreateAllottedPlot(allottedPlot: AllottedPlotDto) {
    return this.post<AllottedPlotDto>(CREATE_ALLOTTEDPLOT_URI, allottedPlot);
  }
  public UpdateAllottedPlot(allottedPlot: AllottedPlotDto) {
    return this.post<AllottedPlotDto>(UPDATE_ALLOTTEDPLOT_URI, allottedPlot);
  }

  public GetAllottedPlots(seasonId: number, forapproval: boolean,param1 = null) {
    let arr : any[] =[];
    arr.push(seasonId);
    arr.push(forapproval);
    if(param1!= null)arr.push(param1);
    if (param1 == null) {
      return this.getWithParams<IAllottedPlotViewDto[]>(GET_ALLOTTEDPLOTS_URI, arr);
    }
    else {
      return this.getWithParams<IAllottedPlotViewDto[]>(GET_ALLOTTEDPLOTS_URI, arr);
    }
  }

  public IsNewFarmer(farmerId: number) {
    return this.getWithId<boolean>(IS_NEW_FARMAR_URI, farmerId);
  }

   // plot assesments
   public GetAllWeed(){
    return this.get<WeedicideDto>(LOOKUP_WEEDS_URI);
  }
}
