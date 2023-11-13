import { Component, ViewChild, inject, OnInit, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedFormCompleteModule } from '../../../commons/shared/shared-form-complete.module';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FormGroupDirective } from '@angular/forms';
import { IResponseListSales } from 'src/app/commons/services/api/sale/sale-api-model.interface';
import { AccountBuyPageService } from './account-buy-page.service';
import { SaleApiService } from 'src/app/commons/services/api/sale/sale-api.service';

@Component({
	standalone: true,
	selector: 'app-account-buy-page',
	templateUrl: './account-buy-page.component.html',
	styleUrls: ['./account-buy-page.component.scss'],
	imports: [RouterModule, MatTableModule, MatMenuModule, MatPaginatorModule, SharedFormCompleteModule],
	providers: [AccountBuyPageService]
})
export class AccountBuyPageComponent implements OnInit, AfterViewInit {
	ngOnInit(): void {
		this._loadSales();
	}
	ngAfterViewInit(): void {
		this.dataSource.paginator = this.paginator!;
	}

	@ViewChild('paginator') paginator: MatPaginator | undefined;
	listSales: IResponseListSales[] = [];

	displayedColumns: string[] = ['operationNumber', 'title', 'quantity', 'total', 'saleDate', 'dateEvent', 'imageUrl'];
	dataSource = new MatTableDataSource<IResponseListSales>();
	pageSizeOptions: number[] = [1, 3, 5];

	private _rowsPageBack = 4;
	private _numberPageBack = 1;
	private _filterPageBack = '';

	private _accountBuyPageService = inject(AccountBuyPageService);
	private _saleApiService = inject(SaleApiService);

	applyFilter(event: Event): void {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	getPaginatorData(): void {
		if (!this.paginator?.hasNextPage()) {
			this._numberPageBack++;
			this._loadSales();
		}
	}

	private _loadSales(): void {
		this._saleApiService
			.getSalesUser(this._filterPageBack, this._numberPageBack, this._rowsPageBack)
			.subscribe((response) => {
				if (response.success) {
					if (response.data.length > 0) {
						this.dataSource.data = this._accountBuyPageService.getDataEvents([...this.dataSource.data], response.data);
					} else {
						this._numberPageBack--;
					}
				}
			});
	}
}
