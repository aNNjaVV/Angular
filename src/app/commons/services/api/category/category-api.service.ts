import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../../../../environments/environment';
import { IResponse, IResponsev2 } from './../api-models-base.interface';
import { IRequestCreateUpdateCategory, IResponseCategory } from './category-api-model.interface';

export const URL_CATEGORY = environment.host + '/category';

@Injectable({
	providedIn: 'root'
})
export class CategoryApiService {
	constructor(private _httpClient: HttpClient) {}

	// Agrega un método privado para obtener las cabeceras con el encabezado personalizado.
	private getHeaders() {
		return new HttpHeaders({
			'X-API': environment.headers['X-API']
		});
	}

	createCategory(request: IRequestCreateUpdateCategory): Observable<IResponsev2<IResponseCategory>> {
		return this._httpClient.post<IResponsev2<IResponseCategory>>(URL_CATEGORY, request, {
			headers: this.getHeaders() // Agrega las cabeceras a la solicitud POST
		});
	}

	getCategorys(): Observable<IResponsev2<IResponseCategory[]>> {
		return this._httpClient.get<IResponsev2<IResponseCategory[]>>(URL_CATEGORY, {
			headers: this.getHeaders() // Agrega las cabeceras a la solicitud GET
		});
	}

	getCategory(id: number): Observable<IResponsev2<IResponseCategory>> {
		const url = `${URL_CATEGORY}/${id}`;
		return this._httpClient.get<IResponsev2<IResponseCategory>>(url, {
			headers: this.getHeaders() // Agrega las cabeceras a la solicitud GET
		});
	}

	updateCategory(
		id: number,
		request: Partial<IRequestCreateUpdateCategory>
	): Observable<IResponsev2<IResponseCategory>> {
		const url = `${URL_CATEGORY}`;
		request.idCategory = id;
		return this._httpClient.put<IResponsev2<IResponseCategory>>(url, request, {
			headers: this.getHeaders() // Agrega las cabeceras a la solicitud PUT
		});
	}

	deleteGenre(id: number): Observable<IResponsev2<number>> {
		const url = `${URL_CATEGORY}/eliminar/${id}`;
		console.log(url);
		return this._httpClient.delete<IResponsev2<number>>(url, {
			headers: this.getHeaders() // Agrega las cabeceras a la solicitud DELETE
		});
	}
}

/*import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../../../../environments/environment';
import { IResponse, IResponsev2 } from './../api-models-base.interface';
import { IRequestCreateUpdateCategory, IResponseCategory } from './category-api-model.interface';

//export const URL_CATEGORY = 'http://localhost:8080/api/category';
export const URL_CATEGORY = environment.host + '/category';
@Injectable({
	providedIn: 'root'
})
export class CategoryApiService {
	constructor(private _httpClient: HttpClient) {}

	createCategory(request: IRequestCreateUpdateCategory): Observable<IResponsev2<IResponseCategory>> {
		return this._httpClient.post<IResponsev2<IResponseCategory>>(URL_CATEGORY, request);
	}

	getCategorys(): Observable<IResponsev2<IResponseCategory[]>> {
		return this._httpClient.get<IResponsev2<IResponseCategory[]>>(URL_CATEGORY);
	}
	getCategory(id: number): Observable<IResponsev2<IResponseCategory>> {
		const url = `${URL_CATEGORY}/${id}`;
		return this._httpClient.get<IResponsev2<IResponseCategory>>(url);
	}
	updateCategory(
		id: number,
		request: Partial<IRequestCreateUpdateCategory>
	): Observable<IResponsev2<IResponseCategory>> {
		const url = `${URL_CATEGORY}`;
		request.idCategory = id;
		return this._httpClient.put<IResponsev2<IResponseCategory>>(url, request);
	}
	deleteGenre(id: number): Observable<IResponsev2<number>> {
		const url = `${URL_CATEGORY}/eliminar/${id}`;
		console.log(url);
		return this._httpClient.delete<IResponsev2<number>>(url);
	}
}*/
