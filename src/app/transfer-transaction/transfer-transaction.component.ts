import { Component, OnInit } from '@angular/core';
import { BackendInteractionService } from '../backend-interaction.service';
import { EventManager } from '@angular/platform-browser';
import { TransactionConstants } from '../constants/transaction-constants';
import { formatCurrency } from '@angular/common';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-transfer-transaction',
  templateUrl: './transfer-transaction.component.html',
  styleUrls: ['./transfer-transaction.component.css']
})
export class TransferTransactionComponent implements OnInit {
  public searchText: string;
  public isAmountToBeSubmitted: boolean;
  public availableAmount: number;
  public amountToBeTransferred: number;
  public formattedAmountToBeTransferred: string;
  public targetAccount: string;
  private lastSortBy: string;
  private sortingOrder: string;
  public originalTransactionList: any;
  public transactionListToBeDisplayed: any;
  public amountTransferForm: FormGroup;
  constructor(private backendInteractionService: BackendInteractionService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.searchText = TransactionConstants.BLANK;
    this.lastSortBy = TransactionConstants.BLANK;
    this.sortingOrder = TransactionConstants.SORTING_ORDER_ASCENDING;
    this.formattedAmountToBeTransferred = TransactionConstants.BLANK;
    this.isAmountToBeSubmitted = true;
    this.availableAmount = 5824.76;
    this.amountTransferForm = this.formBuilder.group({
      "toAccount": [{ value: null, disabled: false }, [Validators.required]],
      "amount": [{ value: null, disabled: false }, [Validators.required]],
    })
    this.backendInteractionService.getTransactions().subscribe(transactionResponse => {
      if (typeof transactionResponse.data !== 'undefined'
        && transactionResponse.data !== null
        && transactionResponse.data instanceof Array) {
        this.originalTransactionList = new Array();
        this.transactionListToBeDisplayed = new Array();
        transactionResponse.data.forEach((transactionObj: any) => {
          transactionObj.formattedAmount = '-' + formatCurrency(parseFloat(transactionObj.amount), 'en', '$', 'USD');
          this.originalTransactionList.push(transactionObj);
          this.transactionListToBeDisplayed.push(transactionObj);
        });
      }
    },
      err => {
      });
  }
  private isAmountOverDrafted = (): boolean => {
    let amountOverdraftFlag : boolean = parseFloat(this.amountTransferForm.value.amount) > TransactionConstants.OVERDRAFT_AMOUNT;
    if(amountOverdraftFlag){
      alert('Account can not be overdrafted beyond a balance of -$500.00');
    }
    return amountOverdraftFlag;
  }
  public previewAmountTransfer = (): void => {
    if (this.amountTransferForm.invalid
          || this.isAmountOverDrafted()) {
      return;
    }
    this.targetAccount = this.amountTransferForm.value.toAccount;
    this.amountToBeTransferred = parseFloat(this.amountTransferForm.value.amount);
    this.isAmountToBeSubmitted = false;
    this.formattedAmountToBeTransferred = '-' + formatCurrency(this.amountToBeTransferred, 'en', '$', 'USD');
    this.amountTransferForm.reset();
  }
  public transferAmount = (): void => {
    this.amountToBeTransferred = Math.round(this.amountToBeTransferred * 100) / 100;
    this.availableAmount -= this.amountToBeTransferred;
    this.availableAmount = Math.round(this.availableAmount * 100) / 100;
    let transactionObject: any = { amount: this.amountToBeTransferred.toString(), categoryCode: TransactionConstants.BLANK, merchant: this.targetAccount, merchantLogo: TransactionConstants.BLANK, transactionDate: Date.now(), transactionType: TransactionConstants.BLANK, formattedAmount: this.formattedAmountToBeTransferred };
    this.transactionListToBeDisplayed = [transactionObject].concat(this.transactionListToBeDisplayed);
    this.originalTransactionList = [transactionObject].concat(this.originalTransactionList);

    this.targetAccount = undefined;
    this.amountToBeTransferred = undefined;
    this.isAmountToBeSubmitted = true;
  }

  public searchForTransactions = (): void => {
    this.transactionListToBeDisplayed = this.searchText.length > 0 ? this.originalTransactionList.filter((transactionObject: any) => transactionObject.merchant.toUpperCase().indexOf(this.searchText.toUpperCase()) !== -1
      || transactionObject.transactionType.toUpperCase().indexOf(this.searchText.toUpperCase()) !== -1) : this.originalTransactionList;
    this.performSortingBy(this.lastSortBy);
  }

  public sortTransactionListBy = (sortBy: string): void => {
    this.determineSortingOrder(sortBy);
    this.performSortingBy(sortBy);
  }

  private performSortingBy = (sortBy: string): void => {
    if (sortBy === TransactionConstants.BLANK) {
      return;
    }
    let sortValueMultiplier: number = (this.sortingOrder === TransactionConstants.SORTING_ORDER_DESCENDING) ? -1 : 1;
    this.transactionListToBeDisplayed.sort((transactionObject1: any, transactionObject2: any) => {
      let sortValueToBeReturned: number;
      switch (sortBy) {
        case TransactionConstants.SORT_BY_DATE_VALUE:
          sortValueToBeReturned = transactionObject1.transactionDate - transactionObject2.transactionDate;
          break;
        case TransactionConstants.SORT_BY_BENEFICIARY_VALUE:
          if (transactionObject1.merchant < transactionObject2.merchant) {
            sortValueToBeReturned = -1;
          } else if (transactionObject1.merchant > transactionObject2.merchant) {
            sortValueToBeReturned = 1;
          } else {
            sortValueToBeReturned = 0;
          }
          break;
        case TransactionConstants.SORT_BY_AMOUNT_VALUE:
          sortValueToBeReturned = parseFloat(transactionObject1.amount) - parseFloat(transactionObject2.amount);
          break;
      }
      sortValueToBeReturned *= sortValueMultiplier;
      return sortValueToBeReturned;
    });
    this.lastSortBy = sortBy;
  }

  private determineSortingOrder = (sortBy: string): void => {
    if (sortBy === this.lastSortBy) {
      this.sortingOrder = (this.sortingOrder === TransactionConstants.SORTING_ORDER_ASCENDING) ? TransactionConstants.SORTING_ORDER_DESCENDING : TransactionConstants.SORTING_ORDER_ASCENDING;
    }
  }
}