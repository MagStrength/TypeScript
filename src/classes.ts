import { baseURL } from "./API/index.js";
import { FlatRentSdk, IFindFlatParams } from "./flat-rent-sdk.js";
import { IFindPlacesParams, IPlaces, IRequestParams } from "./interfaces.js";

export abstract class FindPlaces {
  private static async fetchHomeApi(
    requestParams: IRequestParams
  ): Promise<IPlaces[]> {
    if (requestParams.method === "GET") {
      const fetchURL =
        baseURL +
        requestParams.endPoint +
        this.serializeToGetParams(requestParams.parameters);
      const response = await fetch(fetchURL);
      return await response.json();
    } else {
      const fetchURL = baseURL + requestParams.endPoint;
      const response = await fetch(fetchURL, {
        method: requestParams.method,
        body: JSON.stringify(requestParams.parameters),
      });
      return await response.json();
    }
  }

  private static async getHomeAPI(
    params: IFindPlacesParams
  ): Promise<IPlaces[]> {
    delete params.city;

    const places = await this.fetchHomeApi({
      method: "GET",
      endPoint: "/places",
      parameters: params,
    });

    if (Array.isArray(places)) {
      return places;
    } else {
      return [];
    }
  }

  private static serializeToGetParams(params: {
    [key: string]: string | number | undefined;
  }): string {
    return (
      "?" +
      Object.keys(params)
        .map((key) => `${key}=${params[key]}`)
        .join("&")
    );
  }

  private static async getFlatsSDK(
    params: IFindPlacesParams
  ): Promise<IPlaces[]> {
    const flats = new FlatRentSdk();
    const parameters: IFindFlatParams = {
      city: params?.city ? params.city : "",
      checkInDate: new Date(params.checkInDate),
      checkOutDate: new Date(params.checkOutDate),
    };

    params.maxPrice ? (parameters.priceLimit = params.maxPrice) : null;

    const result = await flats.search(parameters);

    if (!Array.isArray(result)) {
      return [];
    }

    return result.map((flat) => ({
      id: flat.id,
      image: flat.photos[0],
      name: flat.title,
      description: flat.details,
      remoteness: 0,
      bookedDates: flat.bookedDates.map((bookDate) => bookDate.getTime()),
      price: flat.totalPrice,
    }));
  }

  public static async findPlaces(
    params: IFindPlacesParams,
    homy: boolean,
    flatRent: boolean
  ): Promise<IPlaces[]> {
    let allPlaces: IPlaces[] = [];

    if (flatRent) {
      const places = await this.getFlatsSDK(params);
      allPlaces = [...allPlaces, ...places];
    }

    if (homy) {
      const places = await this.getHomeAPI(params);
      allPlaces = [...allPlaces, ...places];
    }

    return allPlaces;
  }

  public static sortPlaces(
    places: IPlaces[],
    orderBy: "price" | "remoteness",
    orderType: "ASC" | "DESC"
  ): IPlaces[] {
    if (orderType === "ASC") {
      return places.sort((a, b) => (a[orderBy] >= b[orderBy] ? 1 : -1));
    }

    if (orderType === "DESC") {
      return places.sort((a, b) => (a[orderBy] <= b[orderBy] ? 1 : -1));
    }

    return places;
  }
}
