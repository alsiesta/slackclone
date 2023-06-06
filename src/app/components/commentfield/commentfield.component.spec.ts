import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentfieldComponent } from './commentfield.component';

describe('CommentfieldComponent', () => {
  let component: CommentfieldComponent;
  let fixture: ComponentFixture<CommentfieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentfieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentfieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
