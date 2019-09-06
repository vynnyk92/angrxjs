import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { combineLatest } from 'rxjs'


import { Product } from './product';
import { Supplier } from '../suppliers/supplier';
import { SupplierService } from '../suppliers/supplier.service';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products111';
  private suppliersUrl = this.supplierService.suppliersUrl;

  public productSelectedBehavioralSubject = new BehaviorSubject<number>(0);
  public productSelectedBehavioralAction$ = this.productSelectedBehavioralSubject.asObservable();

  products$ : Observable<Product[]> = this.http.get<Product[]>(this.productsUrl)
  .pipe(
    map(products=> products.map(prod=> ({
      ...prod,
      price: prod.price*10,
      searchKey: [prod.productName]
    }) as Product)),  
    tap(data => console.log('Products: ', JSON.stringify(data))),
    catchError(this.handleError)
  );

  productsWithCategories$ = combineLatest([
    this.products$,
    this.productCategoryService.productCategories$
  ])
  .pipe(
    map(([products, categ])=> 
    products.map(prod=> ({
        ...prod,
        price: prod.price*10,
        categoryName: categ.find(cat=>cat.id===prod.categoryId).name,
        searchKey: [prod.productName]
      }) as Product)
    )
  );

  selectedProduct$ = combineLatest([
    this.productsWithCategories$,
    this.productSelectedBehavioralAction$
  ]).pipe(
    map(([products, selectedProductId])=>products.find(p=>p.id===selectedProductId)),
    tap(console.log)
  );

  constructor(private http: HttpClient,
              private supplierService: SupplierService,
              private productCategoryService: ProductCategoryService) { }

  private fakeProduct() {
    return {
      id: 42,
      productName: 'Another One',
      productCode: 'TBX-0042',
      description: 'Our new product',
      price: 8.9,
      categoryId: 3,
      category: 'Toolbox',
      quantityInStock: 30
    };
  }

  private handleError(err: any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

}
