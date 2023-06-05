import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelDialogComponent } from './channel-dialog.component';

describe('ChannelDialogComponent', () => {
  let component: ChannelDialogComponent;
  let fixture: ComponentFixture<ChannelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChannelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
