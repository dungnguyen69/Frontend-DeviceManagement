import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvidePermissionComponent } from './provide-permission.component';

describe('ProvidePermissionComponent', () => {
  let component: ProvidePermissionComponent;
  let fixture: ComponentFixture<ProvidePermissionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProvidePermissionComponent]
    });
    fixture = TestBed.createComponent(ProvidePermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
