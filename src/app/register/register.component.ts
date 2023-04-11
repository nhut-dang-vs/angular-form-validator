import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { ApiService } from '../api.service';
import {
  Observable,
  Subject,
  filter,
  map,
  startWith,
  switchMap,
  take,
  tap,
  timer,
} from 'rxjs';

const PASSWORD_PATTERN = /^(?=.*[!@#$%^&*]+)[a-z0-9!@#$%^&*]{6,32}$/;

const validateUserNameFromApi = (api: ApiService) => {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return api.validateUsername(control.value).pipe(
      map((isValid: boolean) => {
        return isValid ? null : { usernameDuplicated: true };
      })
    );
  };
};

const validateUserNameFromApiDebounce = (api: ApiService) => {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return timer(900).pipe(
      switchMap(() =>
        api.validateUsername(control.value).pipe(
          map((isValid: boolean) => {
            return isValid ? null : { usernameDuplicated: true };
          })
        )
      )
    );
  };
};

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  formSubmit$ = new Subject<boolean | null>();

  constructor(private fb: FormBuilder, private api: ApiService) {}

  registerForm = this.fb.group({
    username: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^[a-z]{6,32}$/i),
      ]),
      validateUserNameFromApiDebounce(this.api),
    ],
    password: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(PASSWORD_PATTERN),
      ]),
    ],
    confirmPassword: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(PASSWORD_PATTERN),
      ]),
    ],
  });

  ngOnInit(): void {
    this.formSubmit$
      .pipe(
        tap(() => this.registerForm.markAsDirty()),
        switchMap(() =>
          this.registerForm.statusChanges.pipe(
            startWith(this.registerForm.status),
            tap(() => console.log('above filter', this.registerForm.status)),
            filter((status) => {
              console.log('filter', status);

              return status !== 'PENDING';
            }),
            take(1)
          )
        ),
        filter((status) => status === 'VALID'),
        tap(() => {
          this.submitForm();
        })
      )
      .subscribe();
  }

  submitForm() {
    console.log('submit form');
  }
}
