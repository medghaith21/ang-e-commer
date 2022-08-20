import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProductComponent } from './components/product/product.component';
import { CategoryProductComponent } from './components/category-product/category-product.component';
import { SidebarComponent } from './admin/sidebar/sidebar.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ProductService } from './services/product.service';
import { HttpClientModule } from '@angular/common/http';
import { ProductdetailsComponent } from './components/productdetails/productdetails.component';
import { Routes, RouterModule} from '@angular/router';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { AuthComponent } from './components/auth/auth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './guards/auth.guard';
import { Role } from './common/role';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { AddProductComponent } from './admin/add-product/add-product.component';
import { ToastrModule } from 'ngx-toastr';
import { NavbarComponent } from './admin/navbar/navbar.component';
import { ListProductComponent } from './admin/list-product/list-product.component';
import { UpdateProductComponent } from './admin/update-product/update-product.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { RequestBaseService } from './services/request-base.service';
import { WishlistService } from './services/wishlist.service';
import { CommentComponent } from './components/comment/comment.component';



const routes: Routes = [
  {path: 'products/:id', component: ProductdetailsComponent},
   {path: '', component: HomeComponent},
   {path: 'cart-details', component: CartDetailsComponent},
   {path: 'login', component: AuthComponent},
   {path: 'checkout', component: CheckoutComponent},
   {path: 'dashboard', component: DashboardComponent},
   {path: 'add', component: AddProductComponent},
   { path: 'listProduct', component: ListProductComponent },
   { path: 'updateProduct/:id', component: UpdateProductComponent },
   {path: 'admin', component: DashboardComponent, canActivate: [AuthGuard],
  data: {roles: [Role.ADMIN]}},
  {path: 'order-history', component: OrderHistoryComponent},
  // {path: '401', component: HomeComponent},
  // {path: 'category/:id', component: ProductListComponent},
  // {path: 'category', component: ProductListComponent},
  // {path: 'products', component: ProductListComponent},
  // {path: '', redirectTo: '/products', pathMatch: 'full'},
  // {path: '**', redirectTo: '/products', pathMatch: 'full'}
];
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    ProductComponent,
    CategoryProductComponent,
    SidebarComponent,
    DashboardComponent,
    ProductdetailsComponent,
    CartDetailsComponent,
    CarouselComponent,
    AuthComponent,
    CheckoutComponent,
    AddProductComponent,
    NavbarComponent,
    ListProductComponent,
    UpdateProductComponent,
    OrderHistoryComponent,
    CommentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    FormsModule,
    ToastrModule.forRoot(),
    
  ],
  providers: [ProductService, WishlistService, ],
  bootstrap: [AppComponent]
})
export class AppModule { }
