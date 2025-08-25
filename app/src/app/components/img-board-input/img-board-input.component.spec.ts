import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgBoardInputComponent } from './img-board-input.component';

describe('ImgBoardInputComponent', () => {
  let component: ImgBoardInputComponent;
  let fixture: ComponentFixture<ImgBoardInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImgBoardInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImgBoardInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
