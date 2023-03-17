import { TestBed } from '@angular/core/testing';

import { ProcessImagesService } from './processImages.service';

describe('ProcessImagesService', () => {
  let service: ProcessImagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessImagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
