import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordMatch2Component } from './word-match-2.component';

describe('WordMatch2Component', () => {
  let component: WordMatch2Component;
  let fixture: ComponentFixture<WordMatch2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WordMatch2Component]
    });
    fixture = TestBed.createComponent(WordMatch2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
