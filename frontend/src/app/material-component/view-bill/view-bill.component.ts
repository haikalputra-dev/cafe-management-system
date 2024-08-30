import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ViewBillProductsComponent } from '../dialog/view-bill-products/view-bill-products.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';

@Component({
  selector: 'app-view-bill-products',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss']
})
export class ViewBillComponent implements OnInit {
  displayedColumns: string[] = ['bill_name','email','contact_number','payment_method','total','view'];
  dataSource:any
  responseMessage:any

  constructor(private billService:BillService,
    private ngxService:NgxUiLoaderService,
    private dialog:MatDialog,
    private snackBarService:SnackbarService,
    private router:Router) { }

  ngOnInit(): void {
    this.ngxService.start()
    this.tableData()
  }

  tableData() {
    this.billService.getBills().subscribe((response:any) => {
      this.dataSource = new MatTableDataSource(response.data)
      console.log(response);
      this.ngxService.stop();
    },(error:any) => {
      console.log(error);
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.genericError
      }
      this.snackBarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleViewAction(values:any){
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      data: values
    }
    
    dialogConfig.width = "100%"
    const dialogRef = this.dialog.open(ViewBillProductsComponent,dialogConfig)
    this.router.events.subscribe(()=>{
      dialogRef.close()
    })
  }

  handleDeleteAction(values:any){
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      message: `delete ${values.bill_name} bill`
    }
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig)
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((res)=>{
      this.ngxService.start()
      this.deleteProduct(values.id)
      dialogRef.close();
    })
  }

  deleteProduct(id:any){
    this.billService.delete(id).subscribe((response:any)=>{
      this.ngxService.stop()
      this.tableData()
      this.responseMessage = response?.message
      this.snackBarService.openSnackBar(this.responseMessage, "Close");
    },(error:any)=>{
      console.log(error)
      this.ngxService.stop()
      if (error.error?.message) {
        this.responseMessage = error.error?.message
      }
      else{
        this.responseMessage = GlobalConstants.genericError
      }
      this.snackBarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

}
