import { Component, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExcellentComponent } from '../excellent/excellent.component';

interface Point {
  x: number;
  y: number;
}

interface Match {
  start: Point;
  end: Point;
  correct?: boolean;
  leftIndex: number;
  rightIndex: number;
  leftElement: HTMLElement;
  rightElement: HTMLElement;
}

@Component({
  selector: 'app-word-match',
  templateUrl: './word-match.component.html',
  styleUrls: ['./word-match.component.css']
})
export class WordMatchComponent implements AfterViewInit {
  originalWords = ['ball', 'sun', 'water', 'fly', 'elephant'];
  leftWords: any[] = [];
  rightWords: any[] = [];

  matchedPairs: Match[] = [];

  isDragging = false;
  dragLine = { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } };

  selectedItem: { side: 'left' | 'right', item: any, element: HTMLElement } | null = null;

  constructor(
    private dialog: MatDialog
  ) { }

  ngAfterViewInit() {
    this.resetWords();
  }

  shuffleArray(array: any[]) {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  getRandomColor(): string {
    const colors = ['#FFA07A', '#FFD700', '#90EE90', '#87CEFA', '#DDA0DD', '#F4A460', '#FF69B4'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  resetWords() {
    this.leftWords = this.shuffleArray(this.originalWords.map(word => ({
      word,
      color: this.getRandomColor()
    })));
    this.rightWords = this.shuffleArray(this.originalWords.map(word => ({ word })));
    this.clearMatches();
  }

  clearMatches() {
    this.matchedPairs = [];

    document.querySelectorAll('.word-item[data-side="left"], .word-item[data-side="right"]').forEach(el => {
      (el as HTMLElement).style.backgroundColor = '#f8f8f8';
      (el as HTMLElement).style.color = '#000';
    });
  }

  getElementAnchor(el: HTMLElement, side: 'left' | 'right'): Point {
    const rect = el.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    return {
      x: side === 'left' ? rect.right + scrollX : rect.left + scrollX,
      y: rect.top + rect.height / 2 + scrollY
    };
  }

  startDrag(item: any, side: 'left' | 'right', event: MouseEvent | TouchEvent) {
    if (this.isDragging) return;

    const target = event.currentTarget as HTMLElement;
    const index = Number(target.getAttribute('data-id'));

    this.selectedItem = { side, item, element: target };
    this.isDragging = true;

    const touch = (event instanceof TouchEvent) ? event.touches[0] : event;
    const anchor = this.getElementAnchor(target, side);
    this.dragLine.start = { ...anchor };
    this.dragLine.end = { x: touch.pageX, y: touch.pageY };

    event.stopPropagation();
    event.preventDefault();
  }

  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      this.dragLine.end = { x: event.pageX, y: event.pageY };
    }
  }

  onTouchMove(event: TouchEvent) {
    if (this.isDragging && event.touches.length > 0) {
      const touch = event.touches[0];
      this.dragLine.end = { x: touch.pageX, y: touch.pageY };
    }
  }

  onMouseUp(event: MouseEvent) {
    this.completeDrag(event.target as HTMLElement);
  }

  onTouchEnd(event: TouchEvent) {
    if (!this.isDragging || !this.selectedItem) return;
    const touch = event.changedTouches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement;
    this.completeDrag(target);
  }

  completeDrag(target: HTMLElement) {
    if (!this.isDragging || !this.selectedItem || !target || !target.classList.contains('word-item')) return;
    this.playAudio('../../assets/linematchtime.wav')

    const selectedItem = this.selectedItem; // Narrowed type

    const targetSide = target.getAttribute('data-side') as 'left' | 'right';
    const targetIndex = Number(target.getAttribute('data-id'));
    const selectedIndex = Number(selectedItem.element.getAttribute('data-id'));

    if (targetSide && targetSide !== selectedItem.side) {
      this.matchedPairs = this.matchedPairs.filter(match =>
        !(match.leftIndex === (selectedItem.side === 'left' ? selectedIndex : targetIndex) ||
          match.rightIndex === (selectedItem.side === 'right' ? selectedIndex : targetIndex))
      );

      const leftEl = selectedItem.side === 'left' ? selectedItem.element : target;
      const rightEl = selectedItem.side === 'right' ? selectedItem.element : target;

      this.matchedPairs.push({
        start: this.getElementAnchor(leftEl, 'left'),
        end: this.getElementAnchor(rightEl, 'right'),
        leftIndex: selectedItem.side === 'left' ? selectedIndex : targetIndex,
        rightIndex: selectedItem.side === 'right' ? selectedIndex : targetIndex,
        leftElement: leftEl,
        rightElement: rightEl
      });
    }

    this.resetDrag();
  }


  resetDrag() {
    this.isDragging = false;
    this.selectedItem = null;
  }

  isSave: boolean = false
  TotalPercentage = 0
  saveMatches(type: string) {
    if (type === 'submit') {
      this.isSave = false;

      if (this.TotalPercentage === 100) {
        // alert('Excellent');
        this.dialog.open(ExcellentComponent, {
          width: '100vw',
          height: '100vh',
          panelClass: 'full-screen-dialog'
        });
      } else if (this.TotalPercentage > 75) {
        alert('Awesome');
      } else if (this.TotalPercentage > 50) {
        alert('Good work');
      } else if (this.TotalPercentage > 0) {
        alert('Practice More');
      } else {
        alert('No correct matches. Try again!');
      }
    }
    if (type == 'save') {
      this.isSave = true
      this.playAudio('../../assets/answersavetime.wav');

      let correctCount = 0;
      let incorrectCount = 0;

      for (const match of this.matchedPairs) {
        const leftWord = this.leftWords[match.leftIndex].word.trim().toLowerCase();
        const rightWord = this.rightWords[match.rightIndex].word.trim().toLowerCase();
        const correct = leftWord === rightWord;
        match.correct = correct;

        if (correct) {
          correctCount++;
          const color = this.leftWords[match.leftIndex].color;
          match.leftElement.style.backgroundColor = '#affab0';
          match.leftElement.style.color = '#000';
          match.rightElement.style.backgroundColor = '#affab0';
          match.rightElement.style.color = '#000';
        } else {
          incorrectCount++;
          match.leftElement.style.backgroundColor = '#fcb1b1';
          match.leftElement.style.color = '#000';
          match.rightElement.style.backgroundColor = '#fcb1b1';
          match.rightElement.style.color = '#000';
        }
      }

      const total = correctCount + incorrectCount;
      const percentage = total > 0 ? (correctCount / total) * 100 : 0;
      this.TotalPercentage = percentage
      // Log or display result
      console.log(`Correct: ${correctCount}`);
      console.log(`Incorrect: ${incorrectCount}`);
      console.log(`Score: ${percentage.toFixed(2)}%`);

      // Optional: Show to user
      // alert(`You got ${correctCount} correct out of ${total}.\nScore: ${percentage.toFixed(2)}%`);
    }
  }




  playAudio(url: string): void {
    const audio = new Audio(url);
    audio.play().catch(err => {
      console.error('Failed to play audio:', err);
    });
  }


  onCheck() {
    this.dialog.open(ExcellentComponent, {
      width: '100vw',
      height: '100vh',
      panelClass: 'full-screen-dialog'
    });
  }
}
