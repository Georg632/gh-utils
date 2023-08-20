import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'auth-redirect-button',
  templateUrl: './auth-redirect-button.component.html',
})
export class AuthRedirectButtonComponent {
  @Output() onLogin: EventEmitter<any> = new EventEmitter();
  @Output() onSignUp: EventEmitter<any> = new EventEmitter();
}
