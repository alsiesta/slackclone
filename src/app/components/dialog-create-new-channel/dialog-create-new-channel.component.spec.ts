import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreateNewChannelComponent } from './dialog-create-new-channel.component';

describe('DialogCreateNewChannelComponent', () => {
  let component: DialogCreateNewChannelComponent;
  let fixture: ComponentFixture<DialogCreateNewChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCreateNewChannelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCreateNewChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
