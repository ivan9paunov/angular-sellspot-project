import { ValidatorFn } from "@angular/forms";

export function emailValidator(): ValidatorFn {
    const regExp = new RegExp(/^[A-Za-z0-9_]+(?:[A-Za-z0-9._-]*[A-Za-z0-9_])?@[A-Za-z]+\.[A-Za-z]{2,4}(\.[A-Za-z]{2,4})?$/);
    
    return (control) => {
        const isInvalid = control.value === '' || regExp.test(control.value);
        return isInvalid ? null : { emailValidator: true };
    };
}