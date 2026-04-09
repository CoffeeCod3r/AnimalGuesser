import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatGame } from './cat-game';

describe('CatGame', () => {
  let component: CatGame;
  let fixture: ComponentFixture<CatGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatGame]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatGame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
