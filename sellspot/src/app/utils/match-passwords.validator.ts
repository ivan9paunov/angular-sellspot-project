import { ValidatorFn } from "@angular/forms";

export function matchPasswordsValidator(
    passwordControlName: string,
    repassControlName: string
): ValidatorFn {
    return (control) => {
        const passwordFormControl = control.get(passwordControlName);
        const repassFormControl = control.get(repassControlName);

        const passwordsAreMatching = passwordFormControl?.value === repassFormControl?.value;
        
        return passwordsAreMatching ? null : { matchPasswordsValidator: true };
    }
}