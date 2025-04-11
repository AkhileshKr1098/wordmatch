import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-excellent',
  templateUrl: './excellent.component.html',
  styleUrls: ['./excellent.component.css']
})
export class ExcellentComponent {
  constructor(
    private matDilog: MatDialogRef<ExcellentComponent>
  ) {
    setTimeout(() => {
      this.matDilog.close()
    }, 4000)
  }


}
