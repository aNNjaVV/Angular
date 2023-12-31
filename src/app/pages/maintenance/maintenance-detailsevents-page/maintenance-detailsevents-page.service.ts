import {
	IRequestCreateUpdateGenre,
	IResponseGenre
} from './../../../commons/services/api/genre/genre-api-model.interface';
import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ConfirmBoxEvokeService, ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';
import { concatMap, EMPTY, map, Observable, tap } from 'rxjs';
import { IResponse, IResponsev2 } from '../../../commons/services/api/api-models-base.interface';
import { CRUD_METHOD, STATUS_CRUD } from '../../../commons/utils/enums';
import { DetailsEventsApiService } from 'src/app/commons/services/api/detailsevents/detailsevents-api.service';
// eslint-disable-next-line prettier/prettier
import { IRequestCreateUpdateDetailsEvents, IResponseDetailsEvents } from 'src/app/commons/services/api/detailsevents/detailsevents-api-model.interface';

@Injectable()
export class MaintenanceGenresPageService {
	private _confirmBoxEvokeService = inject(ConfirmBoxEvokeService);
	private _toastEvokeService = inject(ToastEvokeService);
	private _genreApiService = inject(DetailsEventsApiService);
	private _formBuilder = inject(FormBuilder);

	formGroup = this._getFormGroup();

	deleteEvent(idDetailsEvents: number): Observable<boolean> {
		console.log(idDetailsEvents);
		return this._confirmBoxEvokeService.warning('Genero', '¿Esta seguro de eliminar el Genero?', 'Si', 'Cancelar').pipe(
			concatMap((responseQuestion) =>
				responseQuestion.success ? this._genreApiService.deleteGenre(idDetailsEvents) : EMPTY
			),
			concatMap((response) => {
				if (response.success) {
					this._toastEvokeService.success('Exito', 'El evento a sido eliminado');
					return this._succes(true);
				}
				return this._succes(false);
			})
		);
	}

	updateForm(idDetailsEvents: number): Observable<IResponsev2<IResponseDetailsEvents>> {
		console.log(idDetailsEvents);
		console.log('SEXO');
		return this._genreApiService.getDetailsEvents(idDetailsEvents).pipe(
			tap((response) => {
				console.log(response);
				if (response.success) {
					const eventResponse = response.object;
					this.idField.setValue(eventResponse.idDetailsEvents);
					this.nameField.setValue(eventResponse.description);
					this.statusField.setValue(eventResponse.status ? STATUS_CRUD.ACTIVO : STATUS_CRUD.INACTIVO);
				}
			})
		);
	}

	getDataEvents(
		existingData: IResponseDetailsEvents[],
		responseEvents: IResponseDetailsEvents[]
	): IResponseDetailsEvents[] {
		if (existingData && existingData.length > 0) {
			let newArray = responseEvents.filter((eventResponse) => {
				return existingData.some((event) => event.idDetailsEvents === eventResponse.idDetailsEvents);
			});

			if (newArray.length === 0) {
				newArray = existingData.concat(responseEvents);
			} else {
				newArray = existingData
					.filter((event) => {
						return !responseEvents.some((eventResponse) => eventResponse.idDetailsEvents === event.idDetailsEvents);
					})
					.concat(newArray);
			}
			return newArray;
		}
		console.log(responseEvents);
		return responseEvents;
	}

	saveEvent(method: CRUD_METHOD): Observable<boolean> {
		return this._confirmBoxEvokeService
			.warning('Evento', '¿Esta seguro de guardar la información?', 'Si', 'Cancelar')
			.pipe(
				concatMap((responseQuestion) =>
					responseQuestion.success ? this._getMethod(method, this._getRequest(method)) : EMPTY
				),
				concatMap((response) => {
					if (response.success) {
						this._toastEvokeService.success('Exito', 'La información ha sido guardada.');
						return this._succes(true);
					}
					return this._succes(false);
				})
			);
	}

	/**
	 * En esta función vamos a retornar el evento que deseamos guardar o modificar; en el caso de las imagenes puede que al momento de seleccionar el evento para poder modificarlo solo modifiquen atributos de texto o número por lo tanto el valor de la imagen es solo una URL asi que no se debería de enviar, recuerden que el API necesita un base64 para crear una imagen.
	 * @param method
	 * @returns
	 */
	private _getRequest(method: CRUD_METHOD): IRequestCreateUpdateDetailsEvents {
		const request: IRequestCreateUpdateDetailsEvents = <IRequestCreateUpdateDetailsEvents>{
			description: this.nameField.value,
			status: this.statusField.value ? 'ACtivo' : 'iNACTIVO'
		};
		console.log(request);
		return request;
	}

	private _getMethod(
		method: CRUD_METHOD,
		request: IRequestCreateUpdateDetailsEvents
	): Observable<IResponsev2<IResponseDetailsEvents>> {
		const idEvent = this.idField.value as number;
		return method === CRUD_METHOD.SAVE
			? this._genreApiService.createDetailsEvents(request)
			: this._genreApiService.updateDetailsEvents(idEvent, request);
	}

	private _succes(isSucces: boolean): Observable<boolean> {
		return new Observable<boolean>((subscriber) => {
			subscriber.next(isSucces);
			subscriber.complete();
		});
	}

	//#region  load Form and getters y setters

	private _getFormGroup() {
		return this._formBuilder.nonNullable.group({
			id: [0, Validators.required],
			name: ['', Validators.required],
			status: [0, Validators.required]
		});
	}

	get idField(): FormControl<number | null> {
		return this.formGroup.controls.id;
	}

	get nameField(): FormControl<string> {
		return this.formGroup.controls.name;
	}

	get statusField(): FormControl<number> {
		return this.formGroup.controls.status;
	}
	//#endregion
}
