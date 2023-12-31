import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from './../../../../../environments/environment';
import { ResponseHome } from './home-api.class';
import { IResponseHome } from './home-api.interface';

export const URL_HOME = environment.host + '/Home';

@Injectable({ providedIn: 'root' })
export class HomeApiService {
	private urlApi = 'https://rickandmortyapi.com/api/character/1,183';

	constructor(private _httpClient: HttpClient) {}

	getHome(): Observable<ResponseHome> {
		return this._httpClient.get<IResponseHome>(URL_HOME).pipe(map((response) => new ResponseHome(response)));
	}

	public getData(): Observable<any> {
		return this._httpClient.get<any>(this.urlApi);
	}
}
