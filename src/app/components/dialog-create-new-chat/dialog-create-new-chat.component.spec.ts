import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreateNewChatComponent } from './dialog-create-new-chat.component';

describe('DialogCreateNewChatComponent', () => {
  let component: DialogCreateNewChatComponent;
  let fixture: ComponentFixture<DialogCreateNewChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCreateNewChatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCreateNewChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
