import { FormArray, ValidationErrors, AbstractControl } from '@angular/forms';

// Custom validation function for checking duplicate names and codes in a FormArray
export function FormArrayValidationForDuplication(): (control: AbstractControl) => ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    const formArray = control as FormArray;

    // Arrays to store duplicate and unique controls for names and codes
    const duplicateControls: AbstractControl<any, any>[] = [];
    const uniqueControls: AbstractControl<any, any>[] = [];
    const duplicateCodeControls: AbstractControl<any, any>[] = [];
    const uniqueCodeControls: AbstractControl<any, any>[] = [];

    // Check for duplicate names
    formArray.controls.forEach(control => {
      const count = formArray.controls.filter(
        x => x.get("name")!.value
          === control.get("name")!.value
      ).length;
      if (count > 1) {
        // If there is a duplicate name and the value is not empty, add it to duplicateControls
        if(control.get("name")!.value != null && control.get("name")!.value != "") {
          duplicateControls.push(control);
        }
      } else {
        uniqueControls.push(control);
      }
    });

    // Check for duplicate codes
    formArray.controls.forEach(control => {
      const count1 = formArray.controls.filter(
        x => x.get("code")!.value
          === control.get("code")!.value
      ).length;

      if (count1 > 1) {
        // If there is a duplicate code and the value is not empty, add it to duplicateCodeControls
        if(control.get("code")!.value != null && control.get("code")!.value != "") {
          duplicateCodeControls.push(control);
        }
      } else {
        uniqueCodeControls.push(control);
      }
    });

    // Set 'notUnique' error for duplicate name controls
    duplicateControls.forEach(duplicateControl => {
      duplicateControl.get("name")!.setErrors(
        Object.assign({}, duplicateControl.get("name")!.errors, {
          notUnique: true
        })
      );
    });

    // Remove 'notUnique' error for unique name controls
    uniqueControls.forEach((control: any) => {
      let errors = control.get("name").errors;
      if (errors) {
        delete errors.notUnique;
        errors = Object.keys(control.get("name").errors).length ? control.get("name").errors : null;
      }
      control.get("name").setErrors(errors);
    });

    // Set 'notUnique' error for duplicate code controls
    duplicateCodeControls.forEach(duplicateControl => {
      duplicateControl.get("code")!.setErrors(
        Object.assign({}, duplicateControl.get("code")!.errors, {
          notUnique: true
        })
      );
    });
    // Remove 'notUnique' error for unique code controls
    uniqueCodeControls.forEach((control: any) => {
      let errors = control.get("code").errors;
      if (errors) {
        delete errors.notUnique;
        errors = Object.keys(control.get("code").errors).length ? control.get("code").errors : null;
      }
      control.get("code").setErrors(errors);
    });

    return null;
  };
}