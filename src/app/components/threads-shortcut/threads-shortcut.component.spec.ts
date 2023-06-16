import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadsShortcutComponent } from './threads-shortcut.component';

describe('ThreadsShortcutComponent', () => {
  let component: ThreadsShortcutComponent;
  let fixture: ComponentFixture<ThreadsShortcutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreadsShortcutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreadsShortcutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
