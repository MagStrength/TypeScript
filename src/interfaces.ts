export interface IPlaces { 
  id: string,
  image:	string,
  name:	string,
  description:	string,
  remoteness:	number,
  bookedDates: number[],
  price: number
}

export interface IUser{ 
  [key: string]: string,
  username: string,
  avatarUrl: string
}

export interface IRequestParams {
  method: 'GET' | 'PATCH',
  endPoint: string,
  parameters: IGetPlaceParams | IFindPlacesParams | IBookPlaceParams
}

export interface IGetPlaceParams {
  [key: string]: string | number | undefined,
  id: number,
  coordinates?: string,
}

export interface IFindPlacesParams {
  [key: string]: string | number | undefined,
  city?: string,
  coordinates?: string,
  checkInDate: number,
  checkOutDate: number,
  maxPrice?: number
}

export interface IBookPlaceParams {
  [key: string]: number,
  id: number,
  checkInDate: number,
  checkOutDate: number
}
