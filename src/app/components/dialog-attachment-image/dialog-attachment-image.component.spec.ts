import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAttachmentImageComponent } from './dialog-attachment-image.component';

describe('DialogAttachmentImageComponent', () => {
  let component: DialogAttachmentImageComponent;
  let fixture: ComponentFixture<DialogAttachmentImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAttachmentImageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAttachmentImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
