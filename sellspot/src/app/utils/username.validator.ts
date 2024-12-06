import { ValidatorFn } from "@angular/forms";

export function usernameValidator(): ValidatorFn {
    const regExp = new RegExp(/^[A-Za-z0-9_][A-Za-z0-9\._]{3,}$/);
    
    return (control) => {
        const isInvalid = control.value === '' || regExp.test(control.value);
        return isInvalid ? null : { usernameValidator: true };
    };
}