import {
  FarmerSelectInfoViewDto, GetFarmersInSeasonViewDto, IFarmerInPlotOfferDto, IPlotOfferInfoViewDto, IPlotReportViewDto, PlotAssessmentDto,
  PlotAssessmentViewDto, PlotInfoDto, PlotReportDto, PlotsDto, PlotTransferDto, PlotTransferViewDto
} from 'src/app/_models/monitoring';
import { Injectable } from "@angular/core";
import { PlotOfferDto } from "src/app/_models/monitoring";
import { ApiHttpService } from "src/app/_services/api.http.service";
import { CompletedPlotDto, CompletedPlotViewDto } from '../_models/monitoring';
import {
  CREATE_PLOT_OFFER_URI, GET_PLOT_OFFERS_URI, GET_OFFERCODE_URI, UPDATE_PLOT_OFFER_URI, IS_NEW_FARMAR_URI, CREATE_PLOT_REPORT_URI,
  UPDATE_PLOT_REPORT_URI, GET_PLOT_REPORTS_URI, GET_PLOTASSESSMENT_URI, GET_DOCCODE_URI, CREATE_PLOTTRANSFER_URI, UPDATE_PLOTTRANSFER_URI,
  GET_PLOT_REORT_IN_SEASON_URI, GET_DONOFORCOMPLETEDPLOTS_URI, CREATE_COMPLETED_PLOT_URI, GET_COMPLETED_PLOTS_URI, GET_COMPLETED_PLOT_IN_SEASON_URI,
  UPDATE_COMPLETED_PLOT_URI, GET_PLOT_NUMBER_URI, GET_MAINTANANCE_ITEMS_ASSESSMENT_URI, GET_PLOTS_FORASSESSMENT_URI, GET_PLOTS_URI, GET_PLOT_OFFERS_IN_SEASON_URI,
  GET_OFFER_INFO_URI, APPROVE_PLOT_OFFER_URI, GET_PLOTTRANSFERS_URI, GET_REGISTERED_FARMERS_URI, GET_FARMERS_IN_SEASON_URI, GET_PLOT_AGREEMENTS_URI, CREATE_PLOTASSESSMENT_URI, UPDATE_PLOTASSESSMENT_URI, GET_PLOTS_FORAGREEMENT_URI, DENY_PLOT_OFFER_URI
} from "src/app/_services/api.uri.service";

@Injectable({ providedIn: 'root' })
export class MonitoringService extends ApiHttpService {
  // Get new offerNo
  public GetNewOfferNo(seasonId: number) {
    //return this.get<any>(GET_OFFERCODE_URI + seasonId);
    return this.getWithId<boolean>(GET_OFFERCODE_URI, seasonId);
  }

  public CreatePlotOffer(plotOffer: PlotOfferDto) {
    return this.post<PlotOfferDto>(CREATE_PLOT_OFFER_URI, plotOffer);
  }

  public UpdatePlotOffer(plotOffer: PlotOfferDto) {
    return this.post<PlotOfferDto>(UPDATE_PLOT_OFFER_URI, plotOffer);
  }

  public ApprovePlotOffer(plotOffer: PlotOfferDto) {
    return this.post<PlotOfferDto>(APPROVE_PLOT_OFFER_URI, plotOffer);
  }

  public DenyPlotOffer(plotOffer: PlotOfferDto) {
    return this.post<PlotOfferDto>(DENY_PLOT_OFFER_URI, plotOffer);
  }

  public GetPlotOffers(seasonId: number, forapproval: boolean, param1 = null) {
    let arr: any[] = [];
    arr.push(seasonId);
    arr.push(forapproval);
    if (param1 != null) arr.push(param1);
    if (param1 == null) {
      return this.getWithParams<IFarmerInPlotOfferDto[]>(GET_PLOT_OFFERS_URI, arr);
    }
    else {
      return this.getWithParams<IFarmerInPlotOfferDto[]>(GET_PLOT_OFFERS_URI, arr);
    }
  }

  public IsNewFarmer(farmerId: number) {
    return this.getWithId<boolean>(IS_NEW_FARMAR_URI, farmerId);
  }

  // plot assessment
  public GetPlotAssessments(seasonId: number) {
    let arr: any[] = [];
    arr.push(seasonId);
    return this.getWithParams<PlotAssessmentViewDto[]>(GET_PLOTASSESSMENT_URI, arr);
  }
  public CreatePlotAssessment(plotAssessment: PlotAssessmentDto) {
    return this.post<PlotAssessmentDto>(CREATE_PLOTASSESSMENT_URI, plotAssessment);
  }
  public UpdatePlotAssessment(plotAssessment: PlotAssessmentDto) {
    return this.post<PlotAssessmentDto>(UPDATE_PLOTASSESSMENT_URI, plotAssessment);
  }

  public GetPlotsInSeason(seasonId: number, purpose: string) {
    let arr: any[] = [];
    arr.push(seasonId);
    arr.push(purpose);
    return this.getWithParams<PlotInfoDto>(GET_PLOTS_FORASSESSMENT_URI, arr);
  }
  public GetPlotsinfo(plotId: number) {
    return this.getWithId<PlotsDto>(GET_PLOTS_URI, plotId);
  }
// plot agreement

public GetPlotsInSeasons(seasonId: number, purpose: string) {
  let arr: any[] = [];
  arr.push(seasonId);
  arr.push(purpose);
  return this.getWithParams<PlotInfoDto>(GET_PLOTS_FORAGREEMENT_URI, arr);
}
public GetPlotinfo(plotId: number) {
  return this.getWithId<PlotsDto>(GET_PLOTS_URI, plotId);
}
  // Plot Transfers
  public GetAllPlotsTransfers(seasonId: number, param1 = null) {
    let arr: any[] = [];
    arr.push(seasonId);
    if (param1 != null) arr.push(param1);
    if (param1 == null) {
      return this.getWithParams<PlotTransferViewDto[]>(GET_PLOTTRANSFERS_URI, arr);
    }
    else {
      return this.getWithParams<PlotTransferViewDto[]>(GET_PLOTTRANSFERS_URI, arr);
    }
  }

  public GetRegisteredFarmers() {
    return this.get<FarmerSelectInfoViewDto[]>(GET_REGISTERED_FARMERS_URI);
  }

  public GetFarmersInSeason(seasonId: number) {
    return this.get<GetFarmersInSeasonViewDto[]>(GET_FARMERS_IN_SEASON_URI, seasonId);
  }

  // Get new docNo
  public GetNewDocNo(seasonId: number) {
    return this.getWithId<any>(GET_DOCCODE_URI, seasonId);
  }

  public CreatePlotTransfer(plotTransfer: PlotTransferDto) {
    return this.post<PlotTransferDto>(CREATE_PLOTTRANSFER_URI, plotTransfer);
  }

  public UpdatePlotTransfer(plotTransfer: PlotTransferDto) {
    return this.post<PlotTransferDto>(UPDATE_PLOTTRANSFER_URI, plotTransfer);
  }

  public GetPlotReportsInSeason(seasonId: number) {
    return this.getWithId<PlotReportDto>(GET_PLOT_REORT_IN_SEASON_URI, seasonId);
  }

  public CreatePlotReport(plotReport: PlotReportDto) {
    return this.post<PlotReportDto>(CREATE_PLOT_REPORT_URI, plotReport);
  }

  public UpdatePlotReport(plotReport: PlotReportDto) {
    return this.post<PlotReportDto>(UPDATE_PLOT_REPORT_URI, plotReport);
  }

  public PlotOffersInSeason(seasonId: number,plotId: number) {
    let arr: any[] = [];
    arr.push(seasonId);
    arr.push(plotId);
    return this.getWithParams<IPlotOfferInfoViewDto>(GET_PLOT_OFFERS_IN_SEASON_URI, arr);
  }

  public GetOfferInfo(offerId: number) {
    return this.getWithId<any>(GET_OFFER_INFO_URI, offerId);
  }

  // public GetAllottedPlotByAllottedPlotId(allotedPlotId: number) {
  //   return this.getWithId<any>(GET_ALLOTTED_PLOT_URI, allotedPlotId);
  // }

  public GetPlotNumber(allotedPlotId: number) {
    return this.getWithId<any>(GET_PLOT_NUMBER_URI, allotedPlotId, { responseType: 'text' });
  }

  public GetPlotReports(seasonId: number, forapproval: boolean, param1 = null) {
    let arr: any[] = [];
    arr.push(seasonId);
    arr.push(forapproval);
    if (param1 != null) arr.push(param1);
    if (param1 == null) {
      return this.getWithParams<IPlotReportViewDto[]>(GET_PLOT_REPORTS_URI, arr);
    }
    else {
      return this.getWithParams<IPlotReportViewDto[]>(GET_PLOT_REPORTS_URI, arr);
    }
  }


  public CreateCompletedPlot(completedPlot: CompletedPlotDto) {
    return this.post<CompletedPlotDto>(CREATE_COMPLETED_PLOT_URI, completedPlot);
  }

  public UpdateCompletedPlot(completedPlot: CompletedPlotDto) {
    return this.post<CompletedPlotDto>(UPDATE_COMPLETED_PLOT_URI, completedPlot);
  }

  public GetCompletedPlots(seasonId: number) {
    return this.getWithId<any>(GET_COMPLETED_PLOT_IN_SEASON_URI, seasonId);
  }



  public GetNewDocNoForCompletedPlots(seasonId: number) {
    return this.getWithId<any>(GET_DONOFORCOMPLETEDPLOTS_URI, seasonId);
  }


  public GeAllCompletedPlots(seasonId: number, param1 = null) {
    let arr: any[] = [];
    arr.push(seasonId);
    if (param1 != null) arr.push(param1);
    if (param1 == null) {
      return this.getWithParams<CompletedPlotViewDto[]>(GET_COMPLETED_PLOTS_URI, arr);
    }
    else {
      return this.getWithParams<CompletedPlotViewDto[]>(GET_COMPLETED_PLOTS_URI, arr);
    }
  }

  public GetMaintenanceItemsForAssessment(plotAssessmentId: number) {
    return this.getWithId(GET_MAINTANANCE_ITEMS_ASSESSMENT_URI, plotAssessmentId);
  }

  public GetMaintenanceItemsForAgreement(plotAgreementId: number) {
    return this.getWithId(GET_MAINTANANCE_ITEMS_ASSESSMENT_URI, plotAgreementId);
  }

  public GetMaintenanceItemsForYield(plotYieldId: number) {
    return this.getWithId(GET_MAINTANANCE_ITEMS_ASSESSMENT_URI, plotYieldId);
  }

  public GetPlotAgreement(seasonId: number, param1 = null) {
    let arr: any[] = [];
    arr.push(seasonId);
    if (param1 != null) arr.push(param1);

    return this.getWithParams<IFarmerInPlotOfferDto[]>(GET_PLOT_AGREEMENTS_URI, arr);
  }

}
