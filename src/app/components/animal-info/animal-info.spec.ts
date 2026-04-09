import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalInfo } from './animal-info';

describe('AnimalInfo', () => {
  let component: AnimalInfo;
  let fixture: ComponentFixture<AnimalInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimalInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimalInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
