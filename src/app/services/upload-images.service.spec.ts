import { TestBed } from '@angular/core/testing';

import { UploadImagesService } from './upload-images.service';

describe('UploadImagesService', () => {
  let service: UploadImagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadImagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
