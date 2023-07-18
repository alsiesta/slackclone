import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogResetPasswordComponent } from './dialog-reset-password.component';

describe('DialogResetPasswordComponent', () => {
  let component: DialogResetPasswordComponent;
  let fixture: ComponentFixture<DialogResetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogResetPasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
