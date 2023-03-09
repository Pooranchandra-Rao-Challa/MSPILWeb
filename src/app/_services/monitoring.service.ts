import { Injectable } from "@angular/core";
import { AllottedPlotDto, IAllottedPlotViewDto } from "src/app/_models/monitoring";
import { ApiHttpService } from "./api.http.service";
import { CREATE_ALLOTTEDPLOT_URI, GET_ALLOTTEDPLOTS_URI, GET_OFFERCODE_URI, UPDATE_ALLOTTEDPLOT_URI } from "./api.uri.service";

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

  public GetAllottedPlots(seasonId: number, param1 = null) {
    if (param1 == null) {
      return this.getWithId<IAllottedPlotViewDto[]>(GET_ALLOTTEDPLOTS_URI, seasonId);
    }
    else {
      return this.getWithIdAndParam1<IAllottedPlotViewDto[]>(GET_ALLOTTEDPLOTS_URI, seasonId, param1);
    }
  }

}
