export interface IPlaces { 
  id: string,
  image:	string,
  name:	string,
  description:	string,
  remoteness:	number,
  bookedDates: number[],
  price: number
}

export interface IUser { 
  username: string,
  avatarUrl: string
}

export interface IRequestParams {
  method: 'GET' | 'PATCH',
  endPoint: string,
  parameters: IGetPlaceParams | IFindPlacesParams | IBookPlaceParams
}

export interface IGetPlaceParams {
  id: number,
  coordinates?: string,
}

export interface IFindPlacesParams {
  city?: string,
  coordinates?: string,
  checkInDate: number,
  checkOutDate: number,
  maxPrice?: number
}

export interface IBookPlaceParams {
  id: number,
  checkInDate: number,
  checkOutDate: number
}
