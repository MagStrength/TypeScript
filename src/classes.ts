import { FlatRentSdk, IFindFlatParams } from './flat-rent-sdk';
import { IFindPlacesParams, IPlaces } from './interfaces';
import { fetchHomeApi } from './lib';

export class Places { 
  private places:IPlaces[]

  constructor(params: IFindPlacesParams, homy: boolean, flatRent: boolean) { 
    this.search(params, homy, flatRent)
  }

  public async search (params: IFindPlacesParams, homy: boolean, flatRent: boolean):Promise<void> {
    if (flatRent) { 
      const places = await this.getFlatsSDK(params)
      this.places = [...this.places, ...places]
    }

    if (homy) { 
      const places = await this.getHomeAPI(params)
      this.places = [...this.places, ...places]
    }
  }

  public getPlaces(orderBy?: string, orderType?: 'ASC' | 'DESC'):IPlaces[] { 
    if (orderType === 'ASC') { 
      return this.places.sort((a,b) => a['orderBy'] >= b['orderBy'] ? 1 : -1 )
    }
    if (orderType === 'DESC') { 
      return this.places.sort((a,b) => a['orderBy'] <= b['orderBy'] ? 1 : -1 )
    }

    return this.places
  }

  private async getHomeAPI(params: IFindPlacesParams): Promise<IPlaces[]> {
    delete params.city
  
    const places = await fetchHomeApi({
      method: 'GET',
      endPoint: '/places',
      parameters: params
    })
    
  
    if (Array.isArray(places)) {
      return places
    } else { 
      return []
    }
  }

  private async getFlatsSDK(params:IFindPlacesParams): Promise<IPlaces[]> {
    const flats = new FlatRentSdk();
    const parameters: IFindFlatParams = {
      city: params.city,
      checkInDate: new Date(params.checkInDate),
      checkOutDate: new Date(params.checkOutDate),
    }
  
    params.maxPrice ? parameters.priceLimit = params.maxPrice : null
  
    const result = await flats.search(parameters)
  
    if (!Array.isArray(result)) { return [] }
    
    return result.map(flat => ({
      id: flat.id,
      image: flat.photos[0],
      name:	flat.title,
      description:	flat.details,
      remoteness:	null,
      bookedDates: flat.bookedDates.map(bookDate => bookDate.getTime()),
      price: flat.totalPrice
    }))
  }
}
