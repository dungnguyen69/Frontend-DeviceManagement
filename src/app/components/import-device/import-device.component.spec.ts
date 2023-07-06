import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportDeviceComponent } from './import-device.component';

describe('ImportDeviceComponent', () => {
  let component: ImportDeviceComponent;
  let fixture: ComponentFixture<ImportDeviceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImportDeviceComponent]
    });
    fixture = TestBed.createComponent(ImportDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
