import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ProductService } from '../product.service';
import { EMPTY } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class ProductDetailComponent {
  pageTitle = 'Product Detail';
  errorMessage = '';

  product$ = this.productService.selectedProduct$.pipe(
    catchError(err=>{
      console.log(err);
      return EMPTY;
    })
  );

  constructor(private productService: ProductService) { }

}
