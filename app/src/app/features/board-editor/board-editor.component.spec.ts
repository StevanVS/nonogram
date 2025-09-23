import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardEditorComponent } from './board-editor.component';

describe('BoardEditorComponent', () => {
  let component: BoardEditorComponent;
  let fixture: ComponentFixture<BoardEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
