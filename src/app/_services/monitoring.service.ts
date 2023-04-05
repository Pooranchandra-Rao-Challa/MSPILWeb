import {
  IFarmerPlotYieldViewDto,
  FarmerSelectInfoViewDto, GetFarmersInSeasonViewDto, IFarmerInPlotOfferDto, IPlotOfferInfoViewDto, IPlotReportViewDto, PlotAgreementDto, PlotAssessmentDto,
  IPlotAssessmentViewDto, PlotInfoDto, PlotReportDto, PlotsDto, PlotTransferDto, PlotTransferViewDto, SampleDetailsDto
} from 'src/app/_models/monitoring';
import { Injectable } from "@angular/core";
import { PlotOfferDto } from "src/app/_models/monitoring";
import { ApiHttpService } from "src/app/_services/api.http.service";
import { CompletedPlotDto, CompletedPlotViewDto, SampleDto } from '../_models/monitoring';
import {
  CREATE_PLOT_OFFER_URI, GET_PLOT_OFFERS_URI, GET_OFFERCODE_URI, UPDATE_PLOT_OFFER_URI, IS_NEW_FARMAR_URI, CREATE_PLOT_REPORT_URI,
  UPDATE_PLOT_REPORT_URI, GET_PLOT_REPORTS_URI, GET_PLOTASSESSMENT_URI, GET_DOCCODE_URI, CREATE_PLOTTRANSFER_URI, UPDATE_PLOTTRANSFER_URI,
  GET_PLOT_REORT_IN_SEASON_URI, GET_DONOFORCOMPLETEDPLOTS_URI, CREATE_COMPLETED_PLOT_URI, GET_COMPLETED_PLOTS_URI, GET_COMPLETED_PLOT_IN_SEASON_URI,
  UPDATE_COMPLETED_PLOT_URI, GET_PLOT_NUMBER_URI, GET_MAINTANANCE_ITEMS_ASSESSMENT_URI, GET_PLOTS_FORASSESSMENT_URI, GET_PLOTS_URI, GET_PLOT_OFFERS_IN_SEASON_URI,
  GET_OFFER_INFO_URI, APPROVE_PLOT_OFFER_URI, GET_PLOTTRANSFERS_URI, GET_REGISTERED_FARMERS_URI, GET_FARMERS_IN_SEASON_URI, CREATE_PLOTASSESSMENT_URI, UPDATE_PLOTASSESSMENT_URI, DENY_PLOT_OFFER_URI, GET_PLOT_AGREEMENTS_URI, GET_FARMER_IN_SECTIONS_URI, GET_PLOTS_FORYIELDS_URI, GET_PLOTYIELDS_URI, CREATE_PLOT_AGREEMENT_URI, UPDATE_PLOT_AGREEMENT_URI, GET_PLOTS_OF_FARMERS_URI, GET_MAINTANANCE_ITEMS_AGREEMENT_URI, GET_SAMPLES_OF_PLOT_URI, GET_SAMPLES_ENTRY_URI, CREATE_SAMPLES_ENTRY_URI
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
    if (param1 == null) {
      return this.getWithParams<IFarmerInPlotOfferDto[]>(GET_PLOT_OFFERS_URI, [seasonId, forapproval]);
    }
    else {
      return this.getWithParams<IFarmerInPlotOfferDto[]>(GET_PLOT_OFFERS_URI, [seasonId, forapproval, param1]);
    }
  }
  public IsNewFarmer(farmerId: number) {
    return this.getWithId<boolean>(IS_NEW_FARMAR_URI, farmerId);
  }
  // plot assessment
  public GetPlotAssessments(seasonId: number) {
    return this.getWithParams<IPlotAssessmentViewDto[]>(GET_PLOTASSESSMENT_URI, [seasonId]);
  }
  public CreatePlotAssessment(plotAssessment: PlotAssessmentDto) {
    return this.post<PlotAssessmentDto>(CREATE_PLOTASSESSMENT_URI, plotAssessment);
  }
  public UpdatePlotAssessment(plotAssessment: PlotAssessmentDto) {
    return this.post<PlotAssessmentDto>(UPDATE_PLOTASSESSMENT_URI, plotAssessment);
  }

  public GetPlotsInSeason(seasonId: number, purpose: string, plotId: number) {
    return this.getWithParams<PlotInfoDto>(GET_PLOTS_FORASSESSMENT_URI, [seasonId, purpose, plotId]);
  }
  public GetPlotsinfo(plotId: number) {
    return this.getWithId<PlotsDto>(GET_PLOTS_URI, plotId);
  }

  // plot yields

  public GetPlotsInSeasons(seasonId: number, purpose: string) {
    return this.getWithParams<PlotInfoDto>(GET_PLOTS_FORYIELDS_URI, [seasonId, purpose]);
  }
  public GetPlotYields(seasonId: number, param1 = null) {

    if (param1 != null)
      return this.getWithParams<IFarmerPlotYieldViewDto[]>(GET_PLOTYIELDS_URI, [seasonId, param1]);
    else
      return this.getWithParams<IFarmerPlotYieldViewDto[]>(GET_PLOTYIELDS_URI, [seasonId]);
  }

  // Plot Transfers
  public GetAllPlotsTransfers(seasonId: number, param1 = null) {
    if (param1 == null) {
      return this.getWithParams<PlotTransferViewDto[]>(GET_PLOTTRANSFERS_URI, [seasonId]);
    }
    else {
      return this.getWithParams<PlotTransferViewDto[]>(GET_PLOTTRANSFERS_URI, [seasonId, param1]);
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

  public PlotOffersInSeason(seasonId: number, plotId: number) {
    return this.getWithParams<IPlotOfferInfoViewDto>(GET_PLOT_OFFERS_IN_SEASON_URI, [seasonId, plotId]);
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
    if (param1 == null) {
      return this.getWithParams<IPlotReportViewDto[]>(GET_PLOT_REPORTS_URI, [seasonId, forapproval]);
    }
    else {
      return this.getWithParams<IPlotReportViewDto[]>(GET_PLOT_REPORTS_URI, [seasonId, forapproval, param1]);
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
    if (param1 == null) {
      return this.getWithParams<CompletedPlotViewDto[]>(GET_COMPLETED_PLOTS_URI, [seasonId]);
    }
    else {
      return this.getWithParams<CompletedPlotViewDto[]>(GET_COMPLETED_PLOTS_URI, [seasonId, param1]);
    }
  }

  public GetMaintenanceItemsForAssessment(plotAssessmentId: number) {
    return this.getWithId(GET_MAINTANANCE_ITEMS_ASSESSMENT_URI, plotAssessmentId);
  }

  public GetMaintenanceItemsForAgreement(plotAgreementId: number) {
    return this.getWithId(GET_MAINTANANCE_ITEMS_AGREEMENT_URI, plotAgreementId);
  }

  public GetMaintenanceItemsForYield(plotYieldId: number) {
    return this.getWithId(GET_MAINTANANCE_ITEMS_ASSESSMENT_URI, plotYieldId);
  }

  public GetPlotAgreement(seasonId: number, param1 = null) {
    if (param1 != null)
      return this.getWithParams<IFarmerInPlotOfferDto[]>(GET_PLOT_AGREEMENTS_URI, [seasonId, param1]);
    else
      return this.getWithParams<IFarmerInPlotOfferDto[]>(GET_PLOT_AGREEMENTS_URI, [seasonId]);
  }


  public GetSectionFarmers(seasonId: any) {
    return this.getWithId(GET_FARMER_IN_SECTIONS_URI, seasonId);
  }

  public GetPlotsofFarmers(seasonId: any, farmerId: any) {
    return this.getWithParams(GET_PLOTS_OF_FARMERS_URI, [seasonId, farmerId]);
  }

  public GetSamplesOfPlot(plotId: number) {
    return this.getWithId(GET_SAMPLES_OF_PLOT_URI, plotId);
  }

  public GetSeasonSamples(seasonId: number, param1 = null) {
    if (param1 == null) {
      return this.getWithParams<SampleDetailsDto[]>(GET_SAMPLES_ENTRY_URI, [seasonId]);
    }
    else {
      return this.getWithParams<SampleDetailsDto[]>(GET_SAMPLES_ENTRY_URI, [seasonId, param1]);
    }
  }

  public CreatePlotAgreement(plotAgreement: PlotAgreementDto) {
    return this.post<PlotAgreementDto>(CREATE_PLOT_AGREEMENT_URI, plotAgreement);
  }

  public UpdatePlotAgreement(plotAgreement: PlotAgreementDto) {
    return this.post<PlotAgreementDto>(UPDATE_PLOT_AGREEMENT_URI, plotAgreement);
  }

  public CreateSample(Sample: SampleDto) {
    debugger
    return this.post<SampleDto>(CREATE_SAMPLES_ENTRY_URI, Sample);
  }

}
