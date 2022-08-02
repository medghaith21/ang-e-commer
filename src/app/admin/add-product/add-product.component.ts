import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ProductService } from './../../services/product.service';
import { CategoryProductService } from './../../services/category-product.service';
import { CategoryProduct } from './../../common/category-product';
import { Product } from '../../common/product';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators }
  from '@angular/forms';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css', '../../../assets/admin/css/paper-dashboard.css?v=2.0.1', '../../../assets/admin/demo/demo.css', '../../../assets/admin/css/bootstrap.min.css',],
  encapsulation: ViewEncapsulation.ShadowDom 
})
export class AddProductComponent implements OnInit {

  files:string  []  =  [];
  selectedFiles!: FileList;
  images : string[] = [];
  product : Product = new Product()
  categories!: CategoryProduct[];
  errorMessage: string = "";
  userFile: any;
  public imagePath : any;
  imgURL: any;

  constructor(public productService: ProductService, private router: Router, private categoryProductService: CategoryProductService, public toastr: ToastrService, private fb: FormBuilder, ) { }

  ngOnInit(): void {
    this.categoryProductService.getProductCategories().subscribe(data => {
      this.categories = data
    })
    this.infoForm()
  }

  infoForm() {
    this.productService.dataForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      nprix: [0, [Validators.required]],
      gprix: [0, [Validators.required]],
      quantity: [0, [Validators.required]],
      category: ['', [Validators.required]],
    });
  }

  addProduct(){
    const formData = new FormData();
    
    const product = this.productService.dataForm.value;
    // formData.append('article', JSON.stringify(product));
    formData.append('product', JSON.stringify(product));
    
     for (let i = 0; i < this.files.length; i++) {
       formData.append('files', this.files[i]);
       console.log(formData)
     }
    // formData.append('file', this.userFile);
    
    this.productService.addTask(formData).subscribe(data => {
      this.router.navigate(['/']);
    }) 
   
  }

  setNewCategory(category: CategoryProduct): void {
    console.log(category);
    this.productService.dataForm.value.category  = category;
    }


    onSelectFile(event : any) {
      if (event.target.files.length > 0) {
       const file = event.target.files[0];
       for  (var i =  0; i <  event.target.files.length; i++)  {  
        this.files.push(event.target.files[i]);
    }
        // const files = event.target.files;
       // this.selectedFiles = files;
        // this.f['profile'].setValue(file);
        
        var mimeType = event.target.files[0].type;
        if (mimeType.match(/image\/*/) == null) {
          this.toastr.success('Only images are supported.');
  
          return;
        }
        var reader = new FileReader();
        this.imagePath = file;
        reader.readAsDataURL(file);
        reader.onload = (_event) => {
          this.imgURL = reader.result;
        }
       
      }
    }
  

}
