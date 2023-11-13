import { ConfirmBoxEvokeService } from '@costlydeveloper/ngx-awesome-popup';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { SharedFormCompleteModule } from '../../../commons/shared/shared-form-complete.module';
import { DetailsEventsApiService } from '../../../commons/services/api/detailsevents/detailsevents-api.service';
import { CRUD_METHOD } from '../../../commons/utils/enums';
import { FormGroupDirective } from '@angular/forms';
import { IResponseDetailsEvents } from 'src/app/commons/services/api/detailsevents/detailsevents-api-model.interface';
import { MaintenanceGenresPageService } from './maintenance-detailsevents-page.service';
import { map, Observable } from 'rxjs';
@Component({
	standalone: true,
	selector: 'app-maintenance-detailsevents-page',
	templateUrl: './maintenance-detailsevents-page.component.html',
	styleUrls: ['./maintenance-detailsevents-page.component.scss'],
	imports: [RouterModule, MatTableModule, MatTabsModule, MatMenuModule, MatPaginatorModule, SharedFormCompleteModule],
	providers: [MaintenanceGenresPageService]
})
export default class MaintenanceGenresPageComponent implements OnInit, AfterViewInit {
	@ViewChild('paginator') paginator: MatPaginator | undefined;
	@ViewChild(FormGroupDirective) formRef!: FormGroupDirective;
	listGenres: IResponseDetailsEvents[] = [];
	indexTabSaveEvent = 0;

	displayedColumns: string[] = ['name', 'status', 'action'];
	dataSource = new MatTableDataSource<IResponseDetailsEvents>();
	pageSizeOptions: number[] = [2, 4, 6];
	private _rowsPageBack = 4;
	private _numberPageBack = 1;
	private _crudMethod = CRUD_METHOD.SAVE;

	private _genreApiService = inject(DetailsEventsApiService);
	private _maintenanceGenresPageService = inject(MaintenanceGenresPageService);
	private _confirmBoxEvokeService = inject(ConfirmBoxEvokeService);

	idField = this._maintenanceGenresPageService.idField;
	nameField = this._maintenanceGenresPageService.nameField;
	statusField = this._maintenanceGenresPageService.statusField;

	formGroup = this._maintenanceGenresPageService.formGroup;

	canDeactivate(): Observable<boolean> | boolean {
		const values = this.formGroup.getRawValue();

		const isThereDataEntered = Object.values(values).find((item) => item);
		if (!isThereDataEntered) {
			return true;
		}

		return this._confirmBoxEvokeService
			.warning('Advertencia', 'Los datos ingresados se perderán, ¿Esta seguro que desea salir?', 'Si', 'Cancelar')
			.pipe(map((response) => response.success));
	}

	ngOnInit(): void {
		this._loadDetailsEvents();
	}

	ngAfterViewInit(): void {
		this._loadDetailsEvents();
		this.dataSource.paginator = this.paginator!;
	}

	applyFilter(event: Event): void {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	clickSave(): void {
		if (this.formGroup.valid) {
			this._maintenanceGenresPageService.saveEvent(this._crudMethod).subscribe((response) => {
				if (response) {
					this.formRef.resetForm();
					this._loadDetailsEvents();
				}
			});
		}
		this.getPaginatorData();
	}

	clickClear(): void {
		this._crudMethod = CRUD_METHOD.SAVE;
		this.formRef.resetForm();
	}

	clickUpdate(idCategory: number): void {
		console.log('SEXO');
		this._maintenanceGenresPageService.updateForm(idCategory).subscribe((response) => {
			if (response.success) {
				this.indexTabSaveEvent = 0;
				this._crudMethod = CRUD_METHOD.UPDATE;
			}
		});
	}

	clickDelete(idDetailsEvents: number): void {
		console.log(idDetailsEvents);
		this._maintenanceGenresPageService.deleteEvent(idDetailsEvents).subscribe((response) => {
			if (response) {
				this.dataSource.data = this.dataSource.data.filter((item) => item.idDetailsEvents !== idDetailsEvents);
			}
		});
	}

	getPaginatorData(): void {
		if (!this.paginator?.hasNextPage()) {
			this._numberPageBack++;
			this._loadDetailsEvents();
		}
	}

	private _loadDetailsEvents(): void {
		this._genreApiService.getDetailsEventss().subscribe((response) => {
			if (response.success) {
				if (response.object.length > 0) {
					this.dataSource.data = this._maintenanceGenresPageService.getDataEvents(
						[...this.dataSource.data],
						response.object
					);
				} else {
					this._numberPageBack--;
				}
			}
		});
	}
}
