import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class AlertMessage {

  constructor(private service: MessageService) { }

  displayAlertMessage(message: string) {
    this.service.add({ key: 'tst', severity: 'success', summary: 'Success Message', detail: message, life: 5000 });
  }

  displayErrorMessage(message: string) {
    this.service.add({ key: 'tst', severity: 'error', summary: 'Error Message', detail: message, life: 5000 });
  }

}

/**
 * Please add here more screens info when developer finds new.
 *
 */

/**
 * MessageTypes: Success: S Error: E Waring: W,I: Info,Titles: T
 * ---------------------------------------------------------------------------
 *
 * ---------------------------------------------------------------------------
 * Login forms; L
 * ---------------------------------------------------------------------------
 * Modules;
 * ---------------------------------------------------------------------------
 * Settings : SE
 * Security : S
 * Masters : M
 * Monitoring: MO
 * ---------------------------------------------------------------------------
 * Settings
 *
 * Change Password : CP
 * Security Questions : SQ
 * Config Theme : CT
 *
 * ---------------------------------------------------------------------------
 * Masters; Geo Masters : GM, Bill Masters : BM, Application Masters : AM
 * ---------------------------------------------------------------------------
 * Screens;
 * Geo Masters
 *
 * States : ST
 * Districts : DIS
 * Mandals : M
 * Divisions : DIV
 * Circles : CI
 * Sections : SEC
 * Villages : VI
 *
 * Bill Masters
 *
 * Bills : B
 * Bill Parameters : BP
 * Loan Masters : LM
 * Diesel Rates : DR
 * Distance Rates : DTR
 * Village Param Rates : VPR
 * Diesel Bunks : DB
 * Ware Houses : WH
 *
 * Application Masters
 *
 * Seasons:SE
 * Farmers:FA
 * HGLs :HG
 * TPTs
 * TPTs : T
 * Plant Types
 * Plant Sub Types
 * Varieties : VA
 * Banks
 * Vehicles : VE
 * Lookups
 * Shift:SH
 * Sample Slabs:SS
 *
 * ---------------------------------------------------------------------------
 * Monitoring Screens
 * ---------------------------------------------------------------------------
 * Screens;
 * Plot Offers : PO
 * Plot Reports : PR
 * Plot Assessments : PAS
 * Plot Agreements : PAG
 * Plot Yields : PY
 * Sample Entry : SE
 * Propping: P
 *
 * -----------------------------------------------
 * Permits:
 * -------------------------------------------
 * Estimated Ton:ET
 * Cutting Order:CO
 * Permit Quota :PQ
 * -------------------------------------
 * If the screens has more funcitonal items then
 * Like in settings use frist letter as code, if same
 * code is comming more times then use two letters
 * If two words use to letters
 * --------------------------------------------------
 * ---------------------------------------------------
 * Errors Number shouw be three digits like 001
 *
 * Example if Messages for Setting screen of providers the Message like M2J001
 * On any change in the above counter should be initialized.
 */

export const ALERT_CODES: { [key: string]: string } = {

  // Security questions
  'SCUQ001': 'Security Questions Added Successfully',
  'SCUQ002': 'Security Questions Added Failed',


  //users
  'SUSR001': 'Users Added Successfully',
  'SUSR002': 'Users Updated Successfully',

  // Bill Message
  'SMBMB001': 'Bill Added Successfully',

  // Bill Parameter Message
  'SMBMBP001': 'Bill Parameter Added Successfully',
  'SMBMBP002': 'Bill Parameter Updated Successfully',

  // Village Param Rate Message
  'SMBMVPR001': 'Village Param Rate Added Successfully',
  'SMBMVPR002': 'Village Param Rate Updated Successfully',

  //Application Master =>

  //Seasons Message
  'SMAMSE001': 'Season Added Successfully',
  'SMAMSE002': 'Season Updated Successfully',
  'SMAMSE003' :'Season with same code already exists.',
  'SMAMSE004' :' Season with same name already exists.',

  //Sample Slab Message
  'SMAMSS001': 'Sample Slab Added Successfully',
  'SMAMSS002': 'Sample Slab Updated Successfully',

  //Shift Message
  'SMAMSH001': 'Shift Added Successfully',
  'SMAMSH002': 'Shift Updated Successfully',

  // HGLs Message
  'SMAMHG001': 'HGL Added Successfully',
  'SMAMHG002': 'HGL Updated Successfully',
  'SMAMHG003' :'HGL with same code already exists.',
  'SMAMHG004' :' HGL with same name already exists.',

  //Farmers
  'SMAMFA001': 'Farmer Added Successfully',
  'SMAMFA002': 'Farmer Updated Successfully',
  'SMAMFA003' :'Farmer with same code already exists.',
  'SMAMFA004' :' Farmer with same name already exists.',

  //Geo Master =>
  //State
  'SMGMST001': 'State Added Successfully',
  'SMGMST002': 'State Updated Successfully',

  // Divisions
  'SMGMDIV001': 'Division Added Successfully',
  'SMGMDIV002': 'Division Updated Successfully',

  // Districts
  'SMGMDIS001': 'District Added Successfully',
  'SMGMDIS002': 'District Updated Successfully',

  // Mandals
  'SMGMM001': 'Mandal Added Successfully',
  'SMGMM002': 'Mandal Updated Successfully',

  //Villages Message
  'SMMGMVI001': 'Village Added Successfully',
  'SMMGMVI002': 'Village Updated Successfully',

  //Sections Message
  'SMGMSEC001': 'Section Added Successfully',
  'SMGMSEC002': 'Section Updated Successfully',

  //Circles Circles
  'SMGMCI001': 'Circle Added Successfully',
  'SMGMCI002': 'Circle Updated Successfully',

  // Diesel Rate Message
  'SMBMDR001': 'Diesel Rate Added Successfully',
  'SMBMDR002': 'Diesel Rate Updated Successfully',

  // Distance Rate Message
  'SMBMDTR001': 'Distance Rate Added Successfully',
  'SMBMDTR002': 'Distance Rate Updated Successfully',

  // Diesel Bunk Message
  'SMBMDB001': 'Diesel Bunk Added Successfully',
  'SMBMDB002': 'Diesel Bunk Updated Successfully',

  // TPT Message
  'SMAMT001': 'TPT Added Successfully',
  'SMAMT002': 'TPT Updated Successfully',
  'SMAMT003' :'TPT with same code already exists.',
  'SMAMT004' :' TPT with same name already exists.',

  // Variety Message
  'SMAMVA001': 'Variety Added Successfully',
  'SMAMVA002': 'Variety Updated Successfully',

  // Vehicle Message
  'SMAMVE001': 'Vehicle Added Successfully',
  'SMAMVE002': 'Vehicle Updated Successfully',

  //Ware House
  'SMBMWH001': 'Ware House Added Successfully',
  'SMBMWH002': 'Ware House Updated Successfully',
  'SMBMWH003': 'Code Should Be Unique',

  //Loan Types
  'SMBMLM001': 'Loan Type  Added Successfully',
  'SMBMLM002': 'Loan Type Updated Successfully',

  // Bank

  'SMAMBA001': 'Bank Added Successfully',
  'SMAMBA002': 'Bank Updated Successfully',

  // planttype
  'SMAMPT001': 'Plant Type Added Successfully',
  'SMAMPT002': 'Plant Type Updated Successfully',
  'SMAMPT003' :'Plant Type with same code already exists.',
  'SMAMPT004' :' Plant Type with same name already exists.',

  // plantsubtype
  'SMAMPST001': 'Plant Sub Type Added Successfully',
  'SMAMPST002': 'Plant Sub Type Updated Successfully',

  // Lookup
  'SMAMLU001': 'Lookup Added Successfully',
  'SMAMLU002': 'Lookup Updated Successfully',

  //sample alert
  'SMMSE001': 'Alredy Takeen Sample You Dont Have Any Sample',

  // Monitoring Screens

  // Plot Offers
  'SMOPO001': 'Plot Offers Added Successfully',
  'SMOPO002': 'Plot Offers Updated Successfully',

  // Plot Reports
  'SMOPR001': 'Plot Reports Added Successfully',
  'SMOPR002': 'Plot Reports Updated Successfully',

  // Plot Assessment
  'SMOPAS001': 'Plot Assessment Added Successfully',
  'SMOPAS002': 'Plot Assessment Updated Successfully',

  // Plot Agreement
  'SMOPAG001': 'Plot Agreement Added Successfully',
  'SMOPAG002': 'Plot Agreement Updated Successfully',

  // Plot Yield
  'SMOPY001': 'Plot Yield Added Successfully',
  'SMOPY002': 'Plot Yield Updated Successfully',

  // Plot Transfer
  'SMOPT001': 'Plot Transfer Added Successfully',
  'WMOPT001': 'Plot Transfer is irrevocable, please confirm that this update is correct before proceeding',
  'EMOPT001': 'You have rejected',

  // Sanmple Entry
  'SMOSE001': 'Sample Entry Added Successfully',
  'SMOSE002': 'Sample Entry Updated Successfully',

  // Propping
  'SMOP002': 'Propping Date Is Updated Successfully',

  //  Permits
  // Estimated Ton
  'SMPET001': 'Excess Ton Is Added Successfully',
  'SMPET002': 'Estimated Ton Is Updated Successfully',

  //  scheduleGrouping
  'SMPSG001': 'Schedule Grouping Is Add Successfully',

  // Cutting Order
  'SMPCO001': 'Cutting Order Is Add Successfully',

  //Permit Quota
  'SMPPQ001': 'Permit Quota Is Add Successfully',
  'SMPPQ002': 'Permit Quota Is Update Successfully',

  //Rolls
  'SMR001': 'Roles Add Successfully',
  'SMR002': 'Roles Update Successfully',

  // Config theme
  'SSECT001': 'Theme Is Updated Successfully',

  // Security Questions
  'SSESQ001' : 'Security Questions Is Added Successfully',
  'SSESQ002' : 'Security Questions Is Updated Successfully',
  'SSESQ003' : 'Security Questions Is Updated Failed',
  'SSESQ004' : 'Security Questions Is Deleted Successfully',
  'SSESQ005' : 'Security Questions Is Deleted Failed'
}
