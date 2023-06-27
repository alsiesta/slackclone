import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersShortcutComponent } from './users-shortcut.component';

describe('UsersShortcutComponent', () => {
  let component: UsersShortcutComponent;
  let fixture: ComponentFixture<UsersShortcutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersShortcutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersShortcutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
