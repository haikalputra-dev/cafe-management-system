import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SnackbarService } from '../services/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialogRef } from '@angular/material/dialog';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
loginForm:any = UntypedFormGroup
responseMessage:any

constructor(private formBuilder:UntypedFormBuilder,
  private router: Router,
  private userService: UserService,
  private snackbarService: SnackbarService,
  private ngxService: NgxUiLoaderService,
  private dialogRef: MatDialogRef<LoginComponent>
) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['',[Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      password: [null,[Validators.required]]
    })
  }

  handleSubmit(){
    this.ngxService.start();
    var formData = this.loginForm.value;
    var data = {
      email : formData.email,
      password : formData.password
    }
    this.userService.login(data).subscribe((response:any)=>{
      this.ngxService.stop();
      this.dialogRef.close();  // close the dialog box when login is successful
      localStorage.setItem('token', response.token);
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage, 'Close');
      this.router.navigate(['/cafe/dashboard']);
    },(error) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

}
