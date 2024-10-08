import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm:any = UntypedFormGroup
  responseMessage:any

  constructor(private formBuilder:UntypedFormBuilder,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<ChangePasswordComponent>,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: [null,[Validators.required]],
      newPassword: [null,[Validators.required]],
      confirmPassword: [null,[Validators.required]]
    })
  }

  validateSubmit(){
    if (this.changePasswordForm.controls['newPassword'].value != this.changePasswordForm.controls['confirmPassword'].value) {
      return true
    } else {
      return false      
    }
  }

  handleChangePasswordSubmit(){
    this.ngxService.start()
    var formData = this.changePasswordForm.value;
    var data = {
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword
    }
    this.userService.changePassword(data).subscribe((response:any)=>{
      this.ngxService.stop()
      this.dialogRef.close()
      this.responseMessage = response?.message
      this.snackbarService.openSnackBar(this.responseMessage, "Close")
    },(error) => {
      console.log(error);
      this.ngxService.stop()
      if (error.error?.message) {
        this.responseMessage = error.error?.message
      } 
      else {
        this.responseMessage = GlobalConstants.genericError
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error)
    })
  }

}
