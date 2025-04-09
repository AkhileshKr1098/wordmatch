import { Component, AfterViewInit } from '@angular/core';

interface Point {
  x: number;
  y: number;
}

interface Match {
  start: Point;
  end: Point;
  correct: boolean;
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

  usedLeftIndexes = new Set<number>();
  usedRightIndexes = new Set<number>();

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

    this.matchedPairs = [];
    this.usedLeftIndexes.clear();
    this.usedRightIndexes.clear();

    setTimeout(() => {
      document.querySelectorAll('.word-item[data-side="right"]').forEach(el => {
        (el as HTMLElement).style.backgroundColor = '#f8f8f8';
        (el as HTMLElement).style.color = '#000';

      });
    });
  }

  clearMatches() {
    this.matchedPairs = [];
    this.usedLeftIndexes.clear();
    this.usedRightIndexes.clear();

    document.querySelectorAll('.word-item[data-side="right"]').forEach(el => {
      (el as HTMLElement).style.backgroundColor = '#f8f8f8';
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

    if ((side === 'left' && this.usedLeftIndexes.has(index)) ||
      (side === 'right' && this.usedRightIndexes.has(index))) {
      return;
    }

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
    if (this.isDragging && this.selectedItem && target && target.classList.contains('word-item')) {
      const targetSide = target.getAttribute('data-side') as 'left' | 'right';
      const targetIndex = Number(target.getAttribute('data-id'));

      if (targetSide && targetSide !== this.selectedItem.side) {
        if ((targetSide === 'left' && this.usedLeftIndexes.has(targetIndex)) ||
          (targetSide === 'right' && this.usedRightIndexes.has(targetIndex))) {
          this.resetDrag();
          return;
        }

        const targetAnchor = this.getElementAnchor(target, targetSide);
        const word1 = this.selectedItem.item.word.trim().toLowerCase();
        const word2 = target.innerText.trim().toLowerCase();
        const correct = word1 === word2;

        this.matchedPairs.push({
          start: { ...this.dragLine.start },
          end: { ...targetAnchor },
          correct
        });

        const selectedIndex = Number(this.selectedItem.element.getAttribute('data-id'));
        if (this.selectedItem.side === 'left') {
          this.usedLeftIndexes.add(selectedIndex);
          this.usedRightIndexes.add(targetIndex);
        } else {
          this.usedRightIndexes.add(selectedIndex);
          this.usedLeftIndexes.add(targetIndex);
        }
        if (correct) {
          target.style.backgroundColor = this.selectedItem.item.color;
          target.style.color = '#000'; // reset to black
        } else {
          target.style.backgroundColor = '#f8d7da'; // red bg
          target.style.color = '#d00000'; // red text
        }
      }
    }

    this.resetDrag();
  }

  resetDrag() {
    this.isDragging = false;
    this.selectedItem = null;
  }

}
