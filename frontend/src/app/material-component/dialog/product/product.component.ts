import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  onAddProduct = new EventEmitter()
  onEditProduct = new EventEmitter()
  productForm:any = UntypedFormGroup
  dialogAction:any = "Add"
  action:any = "Add"
  responseMessage:any
  categories:any = []

  constructor(@Inject(MAT_DIALOG_DATA)public dialogData:any,
  private formBuilder:UntypedFormBuilder,
  private productService:ProductService,
  private dialogRef:MatDialogRef<ProductComponent>,
  private categoryService:CategoryService,
  private snackBarService:SnackbarService) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      product_name:[null,[Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      category_id:[null,[Validators.required]],
      price:[null,[Validators.required, Validators.min(1)]],
      description:[null,[Validators.required]]
    })

    if(this.dialogData.action === 'Edit'){
      this.dialogAction = "Edit"
      this.action = "Update"
      this.productForm.patchValue(this.dialogData.data);
    }
    this.getCategories()
  }

  getCategories() {
    this.categoryService.getCategory().subscribe(
      (response: any) => {
        this.categories = response; // Depending on structure
      },
      (err: any) => {
        if (err.error?.message) {
          this.responseMessage = err.error.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackBarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }
  

  handleSubmit(){
    if (this.dialogAction === 'Edit') {
      this.edit()
    }
    else{
      this.add()
    }
  }
  add(){
    var formData = this.productForm.value
    var data = {
      product_name:formData.product_name,
      category_id:formData.category_id,
      price:formData.price,
      description:formData.description
    }
    this.productService.add(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onAddProduct.emit();
      this.responseMessage = response.message
      this.snackBarService.openSnackBar(this.responseMessage, "Close")
    },(error:any)=>{
      if (error.error?.message) {
        this.responseMessage = error.error?.message
      }
      else{
        this.responseMessage = GlobalConstants.genericError
      }
      this.snackBarService.openSnackBar(this.responseMessage, GlobalConstants.error)
    })
  }
  edit(){
    var formData = this.productForm.value
    var data = {
      id: this.dialogData.data.id,
      product_name:formData.product_name,
      category_id:formData.category_id,
      price:formData.price,
      description:formData.description
    }
    this.productService.update(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onEditProduct.emit();
      this.responseMessage = response.message
      this.snackBarService.openSnackBar(this.responseMessage, "Close")
    },(error:any)=>{
      if (error.error?.message) {
        this.responseMessage = error.error?.message
      }
      else{
        this.responseMessage = GlobalConstants.genericError
      }
      this.snackBarService.openSnackBar(this.responseMessage, GlobalConstants.error)
    })
  }
}
