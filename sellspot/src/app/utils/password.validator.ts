import { ValidatorFn } from "@angular/forms";

export function passwordValidator(): ValidatorFn {
    const regExp = new RegExp(/^\S{6,}$/);
    
    return (control) => {
        const isInvalid = control.value === '' || regExp.test(control.value);
        return isInvalid ? null : { passwordValidator: true };
    };
}