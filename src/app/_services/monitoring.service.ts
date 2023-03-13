import { Injectable } from "@angular/core";
import { AllottedPlotDto, IAllottedPlotViewDto, PlotReportDto, PlotTransferDto, PlotTransferViewDto,  } from "src/app/_models/monitoring";
import { ApiHttpService } from "./api.http.service";
import { CREATE_ALLOTTEDPLOT_URI, GET_ALLOTTEDPLOTS_URI, GET_OFFERCODE_URI, UPDATE_ALLOTTEDPLOT_URI,IS_NEW_FARMAR_URI, LOOKUP_WEEDS_URI, GET_PLOTASSESSMENT_URI, CREATE_PLOTTRANSFER_URI, UPDATE_PLOTTRANSFER_URI, GET_DOCCODE_URI, GET_PLOTTRANSFER_URI, GET_PLOT_REORT_IN_SEASON_URI } from "./api.uri.service";

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

  // plot assessment
  public GetPlotAssessments(seasonId: number,param1 = null) {
    let arr : any[] =[];
    arr.push(seasonId);
    if(param1!= null)arr.push(param1);
    if (param1 == null) {
      return this.getWithParams<IAllottedPlotViewDto[]>(GET_PLOTASSESSMENT_URI, arr);
    }
    else {
      return this.getWithParams<IAllottedPlotViewDto[]>(GET_PLOTASSESSMENT_URI, arr);
    }
  }
  // Plot Transfers
  public GetAllPlotsTransfers(seasonId: number,param1 = null) {
    let arr : any[] =[];
    arr.push(seasonId);
    if(param1!= null)arr.push(param1);
    if (param1 == null) {
      return this.getWithParams<PlotTransferViewDto[]>(GET_PLOTTRANSFER_URI, arr);
    }
    else {
      return this.getWithParams<PlotTransferViewDto[]>(GET_PLOTTRANSFER_URI, arr);
    }
  }

     // Get new docNo
     public GetNewDocNo(seasonId: number) {
      return this.get<any>(GET_DOCCODE_URI + seasonId);
    }
  public CreatePlotTransfer(plotTransfer: PlotTransferDto) {
    return this.post<PlotTransferDto>(CREATE_PLOTTRANSFER_URI,plotTransfer);
  }
  public UpdatePlotTransfer(plotTransfer: PlotTransferDto) {
    return this.post<PlotTransferDto>(UPDATE_PLOTTRANSFER_URI,plotTransfer);
  }

  public GetPlotReportsInSeason(seasonId: number){
    return this.getWithId<PlotReportDto>(GET_PLOT_REORT_IN_SEASON_URI,seasonId);
  }
}
