import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestforgotpasswordComponent } from './requestforgotpassword.component';

describe('RequestforgotpasswordComponent', () => {
  let component: RequestforgotpasswordComponent;
  let fixture: ComponentFixture<RequestforgotpasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestforgotpasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestforgotpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
