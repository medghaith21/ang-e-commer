import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';


@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.css', '../../../assets/admin/css/paper-dashboard.css?v=2.0.1', '../../../assets/admin/demo/demo.css', '../../../assets/admin/css/bootstrap.min.css',],
  encapsulation: ViewEncapsulation.ShadowDom 
})
export class ListProductComponent implements OnInit {
  productList: Array<Product> = [];
  constructor(private productService: ProductService) {}
  ngOnInit(): void {
    return this.getProducts();
  }
  getProducts(): void {
    this.productService.getProductList().subscribe((data: Product[]) => {
      this.productList = data;
    });
  }

  onDelete(product: Product){
    this.productService.deleteProduct(product).subscribe(
      () => (this.productList = this.productList.filter((t) => t.id !== product.id))
    );
  }

}
