import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-keeper-order-list',
  templateUrl: './keeper-order-list.component.html',
  styleUrls: ['./keeper-order-list.component.scss']
})
export class KeeperOrderListComponent implements OnInit {
  keeperOrderList: any = [];
  constructor(
    private dialogRef: MatDialogRef<KeeperOrderListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.keeperOrderList = data.list;
  }
  ngOnInit(): void { }
}
