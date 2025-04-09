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
  selector: 'app-word-match-2',
  templateUrl: './word-match-2.component.html',
  styleUrls: ['./word-match-2.component.css']
})
export class WordMatch2Component implements AfterViewInit {

  // Both columns use the same word list (duplicates allowed)
  leftWords = [
    { word: 'ball' },
    { word: 'sun' },
    { word: 'water' },
    { word: 'fly' }
  ];
  
  rightWords = [
    { word: 'ball' },
    { word: 'sun' },
    { word: 'water' },
    { word: 'fly' }
  ];

  // Array to store finalized matches
  matchedPairs: Match[] = [];

  // For tracking drag state
  isDragging = false;
  dragLine = { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } };

  // Store the starting word (which side, its data, and its element)
  selectedItem: { side: 'left' | 'right', item: any, element: HTMLElement } | null = null;

  ngAfterViewInit() { }

  // Utility to get the center of an element
  getElementCenter(el: HTMLElement): Point {
    const rect = el.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    return { 
      x: rect.left + rect.width / 2 + scrollX, 
      y: rect.top + rect.height / 2 + scrollY 
    };
  }

  // Start dragging when a word is pressed (works for both columns)
  startDrag(item: any, side: 'left' | 'right', event: MouseEvent) {
    // Prevent starting a new drag if one is already in progress
    if (this.isDragging) { return; }
    const target = event.currentTarget as HTMLElement;
    this.selectedItem = { side, item, element: target };
    this.isDragging = true;
    const center = this.getElementCenter(target);
    this.dragLine.start = { ...center };
    this.dragLine.end = { ...center };
    event.stopPropagation();
    event.preventDefault();
  }

  // Update the temporary line as the mouse moves
  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      this.dragLine.end = { x: event.pageX, y: event.pageY };
    }
  }

  // Complete the drag if the mouse is released on a word in the opposite column
  onMouseUp(event: MouseEvent) {
    if (this.isDragging && this.selectedItem) {
      const target = event.target as HTMLElement;
      // Check if the release target is a word element
      if (target && target.classList.contains('word-item')) {
        const targetSide = target.getAttribute('data-side') as 'left' | 'right';
        // Only finalize if the target is on the opposite column
        if (targetSide && targetSide !== this.selectedItem.side) {
          const targetCenter = this.getElementCenter(target);
          // Finalize the drag line endpoints
          this.dragLine.end = { ...targetCenter };
          // Compare the words (case-insensitive, trimmed)
          const word1 = this.selectedItem.item.word.trim().toLowerCase();
          const word2 = target.innerText.trim().toLowerCase();
          const correct = word1 === word2;
          // Save the finalized match
          this.matchedPairs.push({
            start: { ...this.dragLine.start },
            end: { ...this.dragLine.end },
            correct
          });
        }
      }
      // Reset dragging state
      this.isDragging = false;
      this.selectedItem = null;
    }
  }
}
