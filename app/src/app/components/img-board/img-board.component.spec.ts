import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgBoardComponent } from './img-board.component';

describe('ImgBoardComponent', () => {
  let component: ImgBoardComponent;
  let fixture: ComponentFixture<ImgBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImgBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImgBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
