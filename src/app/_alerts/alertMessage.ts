import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class AlertMessage {

  constructor(private service: MessageService) { }

  displayAlertMessage(message: string) {
    this.service.add({ key: 'tst', severity: 'success', summary: 'Success Message', detail: message, life:30000 });
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
 * Security : S
 * Masters : M
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

  // Bill Message
  'SMBMB001': 'Bill Added Successfully',

  // Bill Parameter Message
  'SMBMBP001': 'Bill Parameter Added Successfully',
  'SMBMBP002': 'Bill Parameter Updated Successfully',

 

  //Application Master => 

  //Seasons Message
  'SMAMSE001': 'Season Added Successfully',
  'SMAMSE002': 'Season Updated Successfully',

  //Sample Slab Message
  'SMAMSS001': 'Shift Added Successfully',
  'SMAMSS002': 'Shift Updated Successfully',

  //Shift Message
  'SMAMSH001': 'Shift Added Successfully',
  'SMAMSH002': 'Shift Updated Successfully',

   // HGLs Message
   'SMAMHG001': 'HGL Added Successfully',
   'SMAMHG002': 'HGL Updated Successfully',
   //Farmers
   'SMAMFA001': 'Farmer Added Successfully',
   'SMAMFA002': 'Farmer Updated Successfully',

   //Geo Master => 

   //Villages Message
  'SMMGMVI001':'Village Added Successfully',
  'SMMGMVI002':'Village Updated Successfully',

   //Sections Message
   'SMGMSEC001':'Section Added Successfully',
   'SMGMSEC002':'Section Updated Successfully',

    //Circles Circles
  'SMGMCI001':'Circle Added Successfully',
  'SMGMCI002':'Circle Updated Successfully',




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
  // Variety Message
  'SMAMVA001': 'Variety Added Successfully',
  'SMAMVA002': 'Variety Updated Successfully',

  // Vehicle Message
  'SMAMVE001': 'Vehicle Added Successfully',
  'SMAMVE002': 'Vehicle Updated Successfully',

  //Loan Types
   'SMBMLM001': 'Loan Type Rate Added Successfully',
   'SMBMLM002': 'Loan Type Rate Updated Successfully',
 
  // Bank

  'SMAMBA001':'Bank Added Successfully',
  'SMAMBA002':'Bank Updated Successfully',

  // planttype
  'SMAMPT001':'Plant Type Added Successfully',
  'SMAMPT002':'Plant Type Updated Successfully',

  //State
  'SMGMST001':'State Added Successfully',
  'SMGMST002':'State Updated Successfully',

}
