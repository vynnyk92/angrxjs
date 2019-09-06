import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { Subscription, Observable, EMPTY, Subject } from 'rxjs';

import { Product } from '../product';
import { ProductService } from '../product.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListAltComponent implements OnInit, OnDestroy {
  pageTitle = 'Products';
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  selectedProductId;

  products$: Observable<Product[]> =  this.productService.productsWithCategories$
  .pipe(
    catchError(err=>{
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );
  
  products: Product[] = [];
  sub: Subscription;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    // this.sub = this.productService.getProducts().subscribe(
    //   products => this.products = products,
    //   error => this.errorMessage = error
    // );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  selectedProd$ = this.productService.productSelectedBehavioralAction$;

  onSelected(productId: number): void {
    console.log(productId);
    this.productService.productSelectedBehavioralSubject.next(productId)
  }
}
