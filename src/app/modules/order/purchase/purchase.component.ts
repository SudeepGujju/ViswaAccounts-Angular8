import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User, Product } from 'app/data-model';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, tap, filter } from 'rxjs/operators';

import { Breadcrumb } from 'app/modules/breadcrumb/breadcrumb';
import { AlertService } from 'app/modules/alert';
import { FacedService } from 'app/services/faced.service';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit {

  public purchaseForm: FormGroup;
  public currentStage = 1;
  private users: User[] = [];
  public filteredOption: Observable<User[]>;
  public filteredProducts: Observable<Product[]>;
  private productNameControl: FormControl;
  public isLoadingProducts = false;
  public breadcrumbConfig: Breadcrumb[];

  public tableDataSource: BehaviorSubject<AbstractControl[]>;
  public columnsToDisplay = ['name', 'quantity', 'mrp', 'opts'];
  public productIDs: string[] = [];

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private facedSrvc: FacedService, private alertSrvc: AlertService) { }

  ngOnInit() {

    this.route.data.subscribe( ({users}) => {
      this.users = users;
    });

    this.breadcrumbConfig = [
      new Breadcrumb('Select Shop', 'store'),
      new Breadcrumb('Choose Products', 'shopping_cart'),
      new Breadcrumb('Place Order', 'list_alt'),
      new Breadcrumb('Order Status', 'receipt')
    ];

    this.purchaseForm = this.fb.group({
      stockistName: ['', {validators: [Validators.required]}],
      stockistId: ['', {validators: [Validators.required]}],
      products: this.fb.array([])
    });

    this.productNameControl = new FormControl('');

    this.filteredOption = this.stockistName.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      startWith(''),
      map((value) => (value ? this._filter(value) : this.users.slice()))
    );

    this.filteredProducts = this.productNameControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter( (value) => typeof value == 'string'),
      tap(() => this.isLoadingProducts = true),
      switchMap( (value) => (value ? this.facedSrvc.getUserProductsList(value, this.stockistId.value) : of([]) ).pipe( finalize(() => this.isLoadingProducts = false)) ),
      map( (products) => products )
    );

    this.tableDataSource = new BehaviorSubject<AbstractControl[]>([]);
  }

  get stockistName() {
    return this.purchaseForm.get('stockistName') as FormControl;
  }

  get stockistId() {
    return this.purchaseForm.get('stockistId') as FormControl;
  }

  get productName() {
    return this.productNameControl;
  }

  get products() {
    return this.purchaseForm.get('products') as FormArray;
  }

  private _filter(value: string): User[] {
    const filterValue = value.toLowerCase();

    return this.users.filter(
      (user) => user.username.toLowerCase().includes(filterValue)
    );
  }

  validateNStockistID(username) {
    const user: any = this.users.find( x => x.username.toLowerCase() == username.toLowerCase());

    if (user) {
      this.stockistId.setValue(user._id);
    } else {
      this.stockistId.setValue('');
      this.stockistName.setErrors({InvalidShop: true});
    }

    this.delteAllProducts();
  }

  public displayFn(product: Product): string {
    return product.name;
  }

  nextStage() {

    switch (this.currentStage) {
      case 1: { 
                if(this.stockistName.valid) {this.currentStage = this.currentStage + 1};
              }
              break;
      case 2: {
                if(this.products.valid) {this.currentStage = this.currentStage + 1};
              }
              break;
      case 3: {
                this.alertSrvc.showConfirmAlert('Do you want to place order?')
                                .afterClosed()
                                .subscribe( (confirmation) => { 
                                  if(confirmation){ 
                                    this.saveOrder();
                                  }
                                }); 
              }
              break;
    }
  }

  previousStage() {
    this.currentStage = this.currentStage - 1;
  }

  addProduct() {

    const product = this.productName.value;

    if (typeof product != 'object') {
      this.productName.setErrors({InvalidProduct: true});
      return;
    }

    if (this.productIDs.indexOf(product._id) != -1) {
      this.productName.setErrors({ProductAlreadyExist: true});
      return;
    }

    this.productIDs.push(product._id);

    const productFormGroup = this.getNewProductForm(product.name, product._id);

    this.products.push(productFormGroup);

    this.tableDataSource.next(this.products.controls);

    this.productName.setValue('');
  }

  deleteProduct(index) {
    this.products.removeAt(index);

    this.tableDataSource.next(this.products.controls);
  }

  getNewProductForm(name: string, id: string) {

    return this.fb.group({
      name: [name, [Validators.required]],
      productId: [id, [Validators.required]],
      quantity: [''],
      mrp: [0, [Validators.required]]
    });
  }

  delteAllProducts() {
    this.products.clear();
    this.tableDataSource.next([]);
  }

  saveOrder() {
    this.facedSrvc.placeOrder(this.purchaseForm.value).subscribe(
      (response) => {
        this.currentStage = this.currentStage + 1;
        console.log(response);
      },
      (error) => {
        this.currentStage = this.currentStage + 1;
        console.log(error);
      }
    );
  }
}


// @Directive({ selector: '[tab-directive]' })
// export class TabDirective implements AfterViewInit, OnDestroy {
//   observable: any;
//   constructor(@Optional() private autoTrigger: MatAutocompleteTrigger,
//    @Optional() private control:NgControl) { }
//   ngAfterViewInit() {
//     this.observable = this.autoTrigger.panelClosingActions.subscribe(x => {
//       if (this.autoTrigger.activeOption) {
//         const value=this.autoTrigger.activeOption.value;
//         if (this.control)
//           this.control.control.setValue(value,{emit:false});
//         this.autoTrigger.writeValue(this.autoTrigger.activeOption.value)
//       }
//     })
//   }
//   ngOnDestroy() {
//     this.observable.unsubscribe();
//   }
// }
