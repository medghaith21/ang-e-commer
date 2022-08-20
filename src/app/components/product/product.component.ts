import { ProductService } from './../../services/product.service';
import { Product } from './../../common/product';
import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';
import { WishlistService } from 'src/app/services/wishlist.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  files : any = []
  id!: number
  products!: Product[];
  fav!: Product[];
  ids!: number[]

  constructor(public productService: ProductService, private cartService: CartService, private wishlistService: WishlistService) {

  }

  ngOnInit(): void {
    this.listProducts();
    this.getfav()
    console.log(this.fav)
  }
  listProducts() {
    this.productService.getProductList().subscribe(data => {
      this.products = data
    })
  }

  addToCart(product: Product){
    const theCartItem = new CartItem(product);
    this.cartService.addToCart(theCartItem);
  }

  getProductImages(){
    this.productService.getImagesByProducts(this.id).subscribe(data=> {
      this.files = data
    })
   
  }

  addToFav(id: number){
    this.wishlistService.addToWishList(id).subscribe(data => {})
  }

  getfav(){
    this.wishlistService.getWishList().subscribe(data => {
      console.log(data)
      this.fav= data
      console.log(this.fav)
    })
   
  }

  removeFromFav(id: number) {
    
    this.wishlistService.deleteWishList(id).subscribe(data => {})
  }
  

}
