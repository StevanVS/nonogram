import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLevelsComponent } from './edit-levels.component';

describe('EditLevelsComponent', () => {
  let component: EditLevelsComponent;
  let fixture: ComponentFixture<EditLevelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditLevelsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
