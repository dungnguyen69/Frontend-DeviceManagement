import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeeperOrderListComponent } from './keeper-order-list.component';

describe('KeeperOrderListComponent', () => {
  let component: KeeperOrderListComponent;
  let fixture: ComponentFixture<KeeperOrderListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KeeperOrderListComponent]
    });
    fixture = TestBed.createComponent(KeeperOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
