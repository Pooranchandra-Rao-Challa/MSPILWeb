import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LookupDetailDto, SeasonDto } from 'src/app/_models/applicationmaster';
import { FarmerSectionViewDto, IPlotsofFarmerViewDto } from 'src/app/_models/monitoring';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { BillMasterService } from 'src/app/_services/billmaster.service';
import { CommonService } from 'src/app/_services/common.service';
import { GeoMasterService } from 'src/app/_services/geomaster.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { MonitoringService } from 'src/app/_services/monitoring.service';
import { CURRENT_SEASON } from 'src/environments/environment';

export interface IHeader {
  field: string;
  header: string;
  label: string;
}

export class SeedDto {
  SeedId?: number;
  SeasonId?: number;
  FarmerCode?: number;
  PlotNo?: number;
  DocNo?: string;
  DocDate?: Date;
  SeedSupplyType?: string;
  TypeOfSeed?: string;
  IsActive?: boolean;
  CreatedAt?: Date;
  CreatedBy?: string;
  UpdatedAt?: Date;
  UpdatedBy?: string;
  subSeeds?: SubSeedDto[]
}
export class SubSeedDto {
  subSeedId?: number;
  SeedId?: number
  FarmerCode?: number;
  FarmerName?: string;
  UOM?: string;
  Qty?: number;
  Rate?: number;
  Amount?: number;
}
@Component({
  selector: 'seed',
  templateUrl: './seed.component.html',
  styles: [],
})
export class SeedComponent implements OnInit {
  showDialog: boolean = false;
  showSubSeed: boolean = false;
  addFlag: boolean = true;
  fbSeed!: FormGroup;
  subSeeds: SubSeedDto[] = [];
  uom: LookupDetailDto[] = [];
  currentSeason: SeasonDto = {};
  seasons!: any[];
  forapproval: boolean = false;
  @ViewChild('filter') filter!: ElementRef;
  submitLabel!: string;
  seedDto: SeedDto[] = [];
  farmers: FarmerSectionViewDto[] = [];

  headers: IHeader[] = [
    // { field: 'SeasonId', header: 'SeasonId', label: 'Season' },
    { field: 'SeasonId', header: 'SeasonId', label: 'Season' },
    { field: 'FarmerCode', header: 'FarmerCode', label: 'Farmer' },
    { field: 'PlotNo', header: 'PlotNo', label: 'Plot No' },
    { field: 'DocNo', header: 'DocNo', label: 'Doc No' },
    { field: 'DocDate', header: 'DocDate', label: 'DocDate' },
    { field: 'SeedSupplyType', header: 'SeedSupplyType', label: 'Seed Supply Type' },
    { field: 'TypeOfSeed', header: 'TypeOfSeed', label: 'Type Of Seed' },
    { field: 'IsActive', header: 'IsActive', label: 'Is Active' },
    { field: 'CreatedAt', header: 'CreatedAt', label: 'Created At' },
    { field: 'CreatedBy', header: 'CreatedBy', label: 'Created By' },
    { field: 'UpdatedAt', header: 'UpdatedAt', label: 'Updated At' },
    { field: 'UpdatedBy', header: 'UpdatedBy', label: 'Updated By' },
  ];
  permissions: any;
  plotNumbers: IPlotsofFarmerViewDto[] = [];
  seedSupplyTypes: LookupDetailDto[] = [];
  typeOfSeeds: LookupDetailDto[] = [];

  constructor(private commonService: CommonService,
    private appMasterservice: AppMasterService,
    private billMasterService: BillMasterService,
    private monitoringService: MonitoringService,
    private geoMasterService: GeoMasterService,
    private formbuilder: FormBuilder,
    private lookupService: LookupService,
    private activatedRoute: ActivatedRoute,
    private jwtService: JWTService) {
  }

  ngOnInit(): void {
    this.permissions = this.jwtService.Permissions;
    this.initSeasons();
    this.initCurrentSeason(CURRENT_SEASON());
    this.initSeedSupplyTypes();
    this.initTypeOfSeeds();
    this.fillData();
    this.seedForm();
    this.initUom();
  }

  initSeasons() {
    this.commonService.GetSeasons().subscribe((resp) => {
      this.seasons = resp as any;
    });
  }

  initSeedSupplyTypes() {
    this.lookupService.SeedSupplyTypes().subscribe((resp) => {
      this.seedSupplyTypes = resp as unknown as LookupDetailDto[];
    });
  }

  initTypeOfSeeds() {
    this.lookupService.TypeOfSeeds().subscribe((resp) => {
      this.typeOfSeeds = resp as unknown as LookupDetailDto[];
    });
  }

  initCurrentSeason(seasonCode: string) {
    this.appMasterservice.CurrentSeason(seasonCode).subscribe((resp) => {
      this.currentSeason = resp as SeasonDto;
      this.getFarmerSections(this.currentSeason.seasonId!);
    });
  }

  getFarmerSections(seasonId: number) {
    this.monitoringService.GetFarmerSections(seasonId).subscribe((resp) => {
      this.farmers = resp as unknown as FarmerSectionViewDto[];
    });
  }

  onSelectedFarmer(farmerId: number) {
    const selectedFarmer = this.farmers.find((farmer) => farmer.farmerId === farmerId);
    if (selectedFarmer) {
      this.fbSeed.controls['farmerName'].setValue(selectedFarmer.farmerName);

      this.getPlotsofFarmers(this.currentSeason.seasonId!, this.fbSeed.controls['farmerId'].value);
    }
  }

  getPlotsofFarmers(seasonId: number, farmerId: number) {
    this.monitoringService.GetPlotsofFarmers(seasonId, farmerId).subscribe((resp) => {
      this.plotNumbers = resp as unknown as IPlotsofFarmerViewDto[];
    });
  }

  onSelectedPlot(plotId: number) {
    let selectedPlot = this.plotNumbers.find(x => x.plotId === plotId);
    if (selectedPlot) {
      this.fbSeed.controls['estimatedTon'].setValue(selectedPlot.netArea);
      this.fbSeed.controls['balancedTon'].setValue(selectedPlot.netArea);
    }
  }

  seedForm() {
    this.fbSeed = this.formbuilder.group({
      seedId: [0],
      seasonId: new FormControl('', [Validators.required]),
      docNo: new FormControl('', [Validators.required]),
      docDate: ['', Validators.required],
      farmerId: new FormControl('', [Validators.required]),
      farmerName: ['', (Validators.required)],
      plotId: new FormControl('', [Validators.required]),
      estimatedTon: [null],
      balancedTon: [null],
      seedSupplyTypeId: ['', Validators.required],
      typeOfSeedId: ['', Validators.required],
      subSeeds: this.formbuilder.array([]),
    });
  }

  /* Form Array For seed Details */
  SubSeedfrom(): FormArray {
    return this.fbSeed.get('subSeeds') as FormArray;
  }

  initUom() {
    this.lookupService.UOMs().subscribe((resp) => {
      this.uom = resp as unknown as LookupDetailDto[];
      console.log(this.uom);
    });
  }

  generateRow(subSeeds: SubSeedDto = new SubSeedDto()): FormGroup {
    if (!this.addFlag) subSeeds.SeedId = this.seedDto[0].SeedId
    return this.formbuilder.group({
      subSeedId: subSeeds.subSeedId == undefined ? 0 : subSeeds.subSeedId,
      SeedId: subSeeds.SeedId,
      FarmerCode: new FormControl(subSeeds.FarmerCode),
      FarmerName: new FormControl(subSeeds.FarmerName),
      UOM: new FormControl(subSeeds.UOM),
      Qty: [subSeeds.Qty, Validators.required],
      Rate: [subSeeds.Rate, Validators.required],
      Amount: subSeeds.Amount,
    });
  }

  addSubSeed() {
    this.showSubSeed = true;
    this.SubSeedfrom().push(this.generateRow());
  }

  getCompletedPlotBySeason(seasonId: number) {
    var seasonId = seasonId ? seasonId : 0;
    this.billMasterService
      .GetVillageParamRatesBySeasonId(seasonId)
      .subscribe((resp) => {
      });
  }

  addSeed() {
    this.submitLabel = 'Add Seed';
    this.addFlag = true;
    this.showDialog = true;
  }

  onSubmit() {
    console.log(this.fbSeed.value)
  }

  fillData() {
    for (var i of [1, 2]) {
      this.seedDto.push(
        {
          SeasonId: i,
          FarmerCode: i,
          PlotNo: 1,
          DocNo: 'DocNo' + i,
          DocDate: new Date(),
          SeedSupplyType: 'seed type',
          TypeOfSeed: 'Type',
          IsActive: true,
          CreatedAt: new Date(),
          CreatedBy: 'CreatedBy' + i,
          UpdatedAt: new Date(),
          UpdatedBy: 'UpdatedBy' + i,
        }
      )
    }
  }

}
