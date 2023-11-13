//#region  GET DATAILSEVENTS
export interface IResponseDetailsEvents {
	idDetailsEvents: number;
	comentarios: string;
	description: string;
	importante: string;
	link: string;
	status: string;
	title: string;
	urlimageref: string;
	event: IHomeEvent;
}
//#endregion

//#region CREATE DATAILSEVENTS
export interface IRequestCreateUpdateDetailsEvents {
	idDetailsEvents: number;
	comentarios: string;
	description: string;
	importante: string;
	link: string;
	status: string;
	title: string;
	urlimageref: string;
	event: IHomeEvent;
}
//#endregion

export interface IHomeEvent {
	idEvent: number;
	title: string;
	description: string;
	dateEvent: string;
	image: string;
	place: string;
	ticketsQuantity: number;
	unitPrice: number;
	status: string;
	category: IHomeCategory;
}

export interface IHomeCategory {
	idCategory: number;
	description: string;
	status: string;
}
