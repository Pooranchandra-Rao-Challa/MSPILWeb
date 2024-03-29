import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LookupDetailDto, SeasonDto } from 'src/app/_models/applicationmaster';
import { FarmerSectionViewDto, IPlotsofFarmerViewDto, SeedDetailDto, SeedDto } from 'src/app/_models/monitoring';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { CommonService } from 'src/app/_services/common.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { MonitoringService } from 'src/app/_services/monitoring.service';
import { CURRENT_SEASON, EDocumentNumberScreens } from 'src/environments/environment';
import { ITableHeader, MaxLength } from 'src/app/_models/common';

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
  seedDetails: SeedDetailDto[] = [];
  UOMs: LookupDetailDto[] = [];
  currentSeason: SeasonDto = {};
  seasons!: any[];
  @ViewChild('filter') filter!: ElementRef;
  submitLabel!: string;
  seedDto: SeedDto[] = [];
  farmers: FarmerSectionViewDto[] = [];
  maxLength: MaxLength = new MaxLength();

  headers: ITableHeader[] = [
    { field: 'seasonCode', header: 'seasonCode', label: 'Season' },
    { field: 'FarmerCode', header: 'FarmerCode', label: 'Farmer' },
    { field: 'PlotNo', header: 'PlotNo', label: 'Plot No' },
    { field: 'DocNo', header: 'DocNo', label: 'Doc No' },
    { field: 'DocDate', header: 'DocDate', label: 'Doc Date' },
    { field: 'SeedSupplyType', header: 'SeedSupplyType', label: 'Seed Supply Type' },
    { field: 'TypeOfSeed', header: 'TypeOfSeed', label: 'Type Of Seed' },
    { field: 'CreatedAt', header: 'CreatedAt', label: 'Created Date' },
    { field: 'CreatedBy', header: 'CreatedBy', label: 'Created By' },
    { field: 'UpdatedAt', header: 'UpdatedAt', label: 'Updated Date' },
    { field: 'UpdatedBy', header: 'UpdatedBy', label: 'Updated By' },
  ];
  permissions: any;
  plotNumbers: IPlotsofFarmerViewDto[] = [];
  seedSupplyTypes: LookupDetailDto[] = [];
  typeOfSeeds: LookupDetailDto[] = [];
  currentSeasonId?: number;

  constructor(private commonService: CommonService,
    private appMasterservice: AppMasterService,
    private monitoringService: MonitoringService,
    private formbuilder: FormBuilder,
    private lookupService: LookupService,
    private jwtService: JWTService) {
  }

  ngOnInit(): void {
    this.permissions = this.jwtService.Permissions;
    this.initSeasons();
    this.initCurrentSeason(CURRENT_SEASON());
    this.initSeedSupplyTypes();
    this.initTypeOfSeeds();
    this.initUOMs();
    this.seedForm();
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

  initUOMs() {
    this.lookupService.UOMs().subscribe((resp) => {
      this.UOMs = resp as unknown as LookupDetailDto[];
    });
  }

  initCurrentSeason(seasonCode: string) {
    this.appMasterservice.CurrentSeason(seasonCode).subscribe((resp) => {
      this.currentSeason = resp as SeasonDto;
      this.currentSeasonId = this.currentSeason.seasonId;
      this.getFarmerSections(this.currentSeason.seasonId!);
    });
  }

  getFarmerSections(seasonId: number) {
    this.monitoringService.GetFarmerSections(seasonId).subscribe((resp) => {
      this.farmers = resp as unknown as FarmerSectionViewDto[];
    });
  }

  getDocNo(seasonId: number) {
    this.commonService.GetDocNo(seasonId, EDocumentNumberScreens.Seed).subscribe((resp) => {
      if (resp)
        this.fbSeed.get('docNo')?.setValue(resp);
    });
    this.getFarmerSections(seasonId);
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
      seedId: [null],
      seasonId: [null, Validators.required],
      docNo: [null, Validators.required],
      docDate: [null, Validators.required],
      farmerId: [null, Validators.required],
      farmerName: [null, Validators.required],
      plotId: [null, Validators.required],
      estimatedTon: [null],
      balancedTon: [null],
      seedSupplyTypeId: [null, Validators.required],
      typeOfSeedId: [null, Validators.required],
      seedDetails: this.formbuilder.array([]),
    });
  }

  get FormControls() {
    return this.fbSeed.controls;
  }

  /* Form Array For seed Details */
  faSeedDetails(): FormArray {
    return this.fbSeed.get('seedDetails') as FormArray;
  }

  addSeedDetails() {
    this.faSeedDetails().push(this.generateRow());
    this.showSubSeed = true;
  }

  generateRow(seedDetail: SeedDetailDto = new SeedDetailDto()): FormGroup {
    if (!this.addFlag) seedDetail.seedId = this.seedDto[0].seedId
    return this.formbuilder.group({
      seedDetailId: seedDetail.seedDetailId == undefined ? 0 : seedDetail.seedDetailId,
      seedId: seedDetail.seedId,
      farmerCode: new FormControl(seedDetail.farmerCode),
      farmerName: new FormControl(seedDetail.farmerName),
      uom: new FormControl(seedDetail.uom),
      qty: [seedDetail.qty, Validators.required],
      rate: [seedDetail.rate, Validators.required],
      amount: [{ value: seedDetail.amount, disabled: true }],
    });
  }

  addSeed() {
    this.addSeedDetails();
    this.getDocNo(this.currentSeasonId!);
    this.fbSeed.controls['seasonId'].setValue(this.currentSeasonId);
    this.submitLabel = 'Add Seed';
    this.addFlag = true;
    this.showDialog = true;
  }

  onSubmit() {
    if (this.fbSeed.valid) {
    }
    else {
      this.fbSeed.markAllAsTouched();
    }
  }

  onClose() {
    this.fbSeed.reset();
    this.faSeedDetails().clear();
  }

}
