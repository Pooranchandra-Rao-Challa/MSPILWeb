/* Regular Expersions */
export const RG_ALPHA_ONLY = /^[a-zA-Z]+(\s+[a-zA-Z]+)*$/;
export const RG_NUMERIC_ONLY = '[0-9]*';
export const RG_ALPHA_NUMERIC = /^[-a-zA-Z0-9-]+(\s+[-a-zA-Z0-9-]+)*$/;
export const RG_PHONE_NO = '^[(][5-9][0-9]{2}[)][-][0-9]{3}[-][0-9]{4}$';
export const RG_VEHICLE = '^[a-zA-Z]{2}[0-9]{2}[- ]{1}[a-zA-Z]{2}[- ]{1}[0-9]{4}$';
export const RG_EMAIL = /^(?!\.)(?!.*\.$)(?!.*\.\.)[a-zA-Z0-9.]{1,}@[a-zA-Z.]{2,9}[.]{1}[a-zA-Z]{2,3}$/;
export const RG_ADDRESS = /^[-a-zA-Z0-9-/]+(\s+[-a-zA-Z0-9-/]+)*$/;
export const RG_PANNO = '^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}$';















/* Min and Max lengths */
export const MIN_LENGTH_2 = 2;
export const MIN_LENGTH_6 = 6;
export const MIN_ACCNO = 9;
export const MAX_LENGTH_6 = 6;
export const MAX_LENGTH_10 = 10;
export const MAX_LENGTH_20 = 20;
export const MAX_LENGTH_30 = 30;
export const MAX_LENGTH_50 = 50;
export const MAX_LENGTH_25 = 25;
