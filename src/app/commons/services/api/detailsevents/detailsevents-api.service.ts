import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../../../../environments/environment';
import { IResponse, IResponsev2 } from './../api-models-base.interface';
import { IRequestCreateUpdateDetailsEvents, IResponseDetailsEvents } from './detailsevents-api-model.interface';

//export const URL_DATAILSEVENTS = 'http://localhost:8080/api/detailsevents';
export const URL_DETAILSEVENTS = environment.host + '/detailsevents';
@Injectable({
	providedIn: 'root'
})
export class DetailsEventsApiService {
	constructor(private _httpClient: HttpClient) {}

	createDetailsEvents(request: IRequestCreateUpdateDetailsEvents): Observable<IResponsev2<IResponseDetailsEvents>> {
		return this._httpClient.post<IResponsev2<IResponseDetailsEvents>>(URL_DETAILSEVENTS, request);
	}

	getDetailsEventss(): Observable<IResponsev2<IResponseDetailsEvents[]>> {
		return this._httpClient.get<IResponsev2<IResponseDetailsEvents[]>>(URL_DETAILSEVENTS);
	}
	getDetailsEvents(id: number): Observable<IResponsev2<IResponseDetailsEvents>> {
		const url = `${URL_DETAILSEVENTS}/${id}`;
		return this._httpClient.get<IResponsev2<IResponseDetailsEvents>>(url);
	}
	updateDetailsEvents(
		id: number,
		request: Partial<IRequestCreateUpdateDetailsEvents>
	): Observable<IResponsev2<IResponseDetailsEvents>> {
		const url = `${URL_DETAILSEVENTS}`;
		request.idDetailsEvents = id;
		return this._httpClient.put<IResponsev2<IResponseDetailsEvents>>(url, request);
	}
	deleteGenre(id: number): Observable<IResponsev2<number>> {
		const url = `${URL_DETAILSEVENTS}/eliminar/${id}`;
		console.log(url);
		return this._httpClient.delete<IResponsev2<number>>(url);
	}
}
