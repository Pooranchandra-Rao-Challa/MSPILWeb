import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class AlertMessage {

  constructor(private service: MessageService) { }

  displayAlertMessage(message: string) {
    this.service.add({ key: 'tst', severity: 'success', summary: 'Success Message', detail: message });
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
 * Circles : C
 * Sections : SE
 * Villages : V
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
 * Farmers
 * HGLs :HG
 * TPTs 
 * Plant Types
 * Plant Sub Types
 * Varieties
 * Banks
 * Vehicles
 * Lookups
 * Shift
 * Sample Slabs
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

  // Bill Parameter Message
  'SMBMBP001': 'Bill Parameter Added Successfully',
  'SMBMBP002': 'Bill Parameter Updated Successfully',

  //Application Master => HGLs Message
  'SMAMHG001': 'HGL Added Successfully',
  'SMAMHG002': 'HGL Updated Successfully',

  //Application Master => HGLs Message
  'SMAMSE001': 'HGL Added Successfully',
  'SMAMSE002': 'HGL Updated Successfully',


  //Billing Master => Seasons 
  'SMBMWH001': 'Season Added Successfully',
  'SMBMWH002': 'Season  Updated Successfully',

}
