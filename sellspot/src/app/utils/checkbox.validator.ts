import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Genres } from "../types/genres";

export function atLeastOneChecked(controlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const group = control.parent as FormGroup;

        if (!group) {
            return null;
        }

        const selectedGenres = group.controls[controlName].value as Genres;

        const isAnyChecked = Object.values(selectedGenres).some((value) => value === true);


        return isAnyChecked ? null : { 'atLeastOneChecked': true };
    };
}