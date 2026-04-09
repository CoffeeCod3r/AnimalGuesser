import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DogGame } from './dog-game';

describe('DogGame', () => {
  let component: DogGame;
  let fixture: ComponentFixture<DogGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DogGame]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DogGame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
