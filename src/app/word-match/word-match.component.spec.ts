import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordMatchComponent } from './word-match.component';

describe('WordMatchComponent', () => {
  let component: WordMatchComponent;
  let fixture: ComponentFixture<WordMatchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WordMatchComponent]
    });
    fixture = TestBed.createComponent(WordMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
