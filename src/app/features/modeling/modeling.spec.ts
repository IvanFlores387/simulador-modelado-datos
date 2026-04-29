import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Modeling } from './modeling';

describe('Modeling', () => {
  let component: Modeling;
  let fixture: ComponentFixture<Modeling>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Modeling]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Modeling);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
