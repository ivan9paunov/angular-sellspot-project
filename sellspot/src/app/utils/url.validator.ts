import { ValidatorFn } from "@angular/forms";

export function urlValidator(): ValidatorFn {
    const regExp = new RegExp(/^(https?:\/\/)?([a-z0-9-]+(\.[a-z0-9-]+)+)(\/.*)?$/);
    
    return (control) => {
        const isInvalid = control.value === '' || regExp.test(control.value);
        return isInvalid ? null : { urlValidator: true };
    };
}