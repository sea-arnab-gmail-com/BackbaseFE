import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferTransactionComponent } from './transfer-transaction.component';

describe('TransferTransactionComponent', () => {
  let component: TransferTransactionComponent;
  let fixture: ComponentFixture<TransferTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
