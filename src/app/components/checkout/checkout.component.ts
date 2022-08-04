import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CartItem } from 'src/app/common/cart-item';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ShopFormServiceService } from 'src/app/services/shop-form-service.service';
import { Router } from '@angular/router';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { User } from 'src/app/common/user';
import { PaymentInfo } from 'src/app/common/payment-info';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

   stripe = Stripe("pk_test_51HGXXNFZZEoYtESMTOXZcTjubq4I49Iro22ewteencnmxfkAL5FP43xBRzOPbu3TuZc8zW9VdQQdNbKJBBCBUSpA00bo1qhgqW");

  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = "";

  isDisabled: boolean = false;

  cartItems : CartItem[] = JSON.parse(localStorage.getItem('cartItems') || '{}');

  user: User = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser') || '{}')
  : null ;

  constructor(private formBuilder: FormBuilder, private shopFormService: ShopFormServiceService, private cartService: CartService, private checkoutService: CheckoutService,
    private router: Router) { }

  ngOnInit(): void {

    this.setupStripePaymentForm();
    
    this.user = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser') || '{}') : null
    console.log(this.user)
    this.reviewCartDetails();
    console.log(this.totalPrice)

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [this.user.fname],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

     // populate credit card months

     const startMonth: number = new Date().getMonth() + 1;
     console.log("startMonth: " + startMonth);
 
     this.shopFormService.getCreditCardMonths(startMonth).subscribe(
       data => {
         console.log("Retrieved credit card months: " + JSON.stringify(data));
         this.creditCardMonths = data;
       }
     );
 
     // populate credit card years
 
     this.shopFormService.getCreditCardYears().subscribe(
       data => {
         console.log("Retrieved credit card years: " + JSON.stringify(data));
         this.creditCardYears = data;
       }
     );

     this.shopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );

    this.cartItems = JSON.parse(localStorage.getItem('cartItems') || '{}');
 
  }

  setupStripePaymentForm() {

    // get a handle to stripe elements
    var elements = this.stripe.elements();

    // Create a card element ... and hide the zip-code field
    this.cardElement = elements.create('card', { hidePostalCode: true });

    // Add an instance of card UI component into the 'card-element' div
    this.cardElement.mount('#card-element');

    // Add event binding for the 'change' event on the card element
    this.cardElement.on('change', (event : any) => {

      // get a handle to card-errors element
      this.displayError = document.getElementById('card-errors');

      if (event.complete) {
        this.displayError.textContent = "";
      } else if (event.error) {
        // show validation error to customer
        this.displayError.textContent = event.error.message;
      }

    });

  }

  reviewCartDetails() {

    // subscribe to cartService.totalQuantity
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );
    console.log(this.totalQuantity)
    // subscribe to cartService.totalPrice
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );

  }

  copyShippingAddressToBillingAddress(event:any) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress
            .setValue(this.checkoutFormGroup.controls.shippingAddress.value);
            this.billingAddressStates = this.shippingAddressStates
    }
    else {
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingAddressStates = []
    }
    
  }

  onSubmit() {
    console.log("Handling the submit button");
     // set up order
     let order = new Order();
     order.totalPrice = this.totalPrice;
     order.totalQuantity = this.totalQuantity;
 
     // get cart items
     const cartItems = this.cartService.cartItems;
 
     // create orderItems from cartItems
     // - long way
     /*
     let orderItems: OrderItem[] = [];
     for (let i=0; i < cartItems.length; i++) {
       orderItems[i] = new OrderItem(cartItems[i]);
     }
     */
 
     // - short way of doing the same thingy
     let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));
 
     // set up purchase
     let purchase = new Purchase();
     
     // populate purchase - customer
     // purchase.customer = this.checkoutFormGroup.controls['customer'].value;
     purchase.customer = this.user;
     
     // populate purchase - shipping address
     purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
     const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
     const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
     purchase.shippingAddress.state = shippingState.name;
     purchase.shippingAddress.country = shippingCountry.name;
 
     // populate purchase - billing address
     purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
     const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
     const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
     purchase.billingAddress.state = billingState.name;
     purchase.billingAddress.country = billingCountry.name;
   
     // populate purchase - order and orderItems
     purchase.order = order;
     purchase.orderItems = orderItems;

     this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = "USD"; 
    this.paymentInfo.receiptEmail = purchase.customer.email;
 
    if (!this.checkoutFormGroup.invalid && this.displayError.textContent === "") {

      this.isDisabled = true;

      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse) => {
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
            {
              payment_method: {
                card: this.cardElement,
                billing_details: {
                  email: purchase.customer.email,
                  name: `${purchase.customer.fname} ${purchase.customer.lname}`,
                  address: {
                    line1: purchase.billingAddress.street,
                    city: purchase.billingAddress.city,
                    state: purchase.billingAddress.state,
                    postal_code: purchase.billingAddress.zipCode,
                    country: this.checkoutFormGroup.controls['billingAddress'].value.country
                  }
                }
              }
            }, { handleActions: false })
          .then(function(this: any, result: any)  {
            if (result.error) {
              // inform the customer there was an error
              alert(`There was an error: ${result.error.message}`);
              this.isDisabled = false;
            } else {
              // call REST API via the CheckoutService
              this.checkoutService.placeOrder(purchase).subscribe({
                next: (response: { orderTrackingNumber: any; }) => {
                  alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);

                  // reset cart
                  this.resetCart();
                  this.isDisabled = false;
                },
                error: (err: { message: any; }) => {
                  alert(`There was an error: ${err.message}`);
                  this.isDisabled = false;
                }
              })
            }            
          }.bind(this));
        }
      );
    } else {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
  }

  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    
    // reset the form
    this.checkoutFormGroup.reset();

    // navigate back to the products page
    this.router.navigateByUrl("/listProduct");
  }


  handleMonthsAndYears() {

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup!.value.expirationYear);

    // if the current year equals the selected year, then start with the current month

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup!.value.country.code;
    const countryName = formGroup!.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.shopFormService.getStates(countryCode).subscribe(
      data => {

        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data; 
        }
        else {
          this.billingAddressStates = data;
        }

        // select first item by default
        formGroup!.get('state')!.setValue(data[0]);
      }
    );
  }

}
