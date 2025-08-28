import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameCopyComponent } from './game-copy.component';

describe('GameCopyComponent', () => {
  let component: GameCopyComponent;
  let fixture: ComponentFixture<GameCopyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameCopyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
