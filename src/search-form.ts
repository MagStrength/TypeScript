import { fetchHomeApi, renderBlock } from './lib.js'
import { IFindPlacesParams, IPlaces } from './interfaces.js'
import { renderSearchResultsBlock } from './search-results.js'
import { FlatRentSdk, IFindFlatParams } from './flat-rent-sdk.js'

const TWO_DAYS = 2
const ONE_MONTH = 1
const TWO_MONTHS = 2

const getStringFromDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = (date.getMonth() + ONE_MONTH).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2,'0')

  return `${year}-${month}-${day}`
}
const getDateFromString = (date: string): Date => new Date(+date.split('-')[0], +date.split('-')[1]-1, +date.split('-')[2])

const minDate: Date = new Date();
const maxDate: Date = new Date(minDate.getFullYear(), minDate.getMonth() + ONE_MONTH, (new Date(minDate.getFullYear(), minDate.getMonth() + TWO_MONTHS, 0)).getDate())
const minCheckoutDate: Date = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate() + TWO_DAYS)

export function renderSearchFormBlock(dateStart: string = getStringFromDate(minDate), dateEnd: string = getStringFromDate(minCheckoutDate)) {
  const dateStartFromString = getDateFromString(dateStart)
  const dateEndFromString = getDateFromString(dateEnd)
  
  renderBlock(
    'search-form-block',
    `
    <form action="#" id="searchForm">
      <fieldset class="search-filedset">
        <div class="row">
          <div>
            <label for="city">Город</label>
            <input id="city" name="city" type="text" value="Санкт-Петербург" />
            <input name="coordinates" type="hidden" value="59.9386,30.3141" />
          </div>
          <div class="providers">
            <label><input type="checkbox" name="provider" value="homy" checked /> Homy</label>
            <label><input type="checkbox" name="provider" value="flat-rent" checked /> FlatRent</label>
          </div>
        </div>
        <div class="row">
          <div>
            <label for="check-in-date">Дата заезда</label>
            <input id="check-in-date" name="check-in-date" type="date" value="${dateStartFromString >= minDate ? dateStart : getStringFromDate(minDate)}" min="${getStringFromDate(minDate)}" max="${getStringFromDate(maxDate)}" name="checkin" />
          </div>
          <div>
            <label for="check-out-date">Дата выезда</label>
            <input id="check-out-date" name="check-out-date" type="date" value="${dateEndFromString <= maxDate ? dateEnd : getStringFromDate(maxDate)}" min="${getStringFromDate(minCheckoutDate)}" max="${getStringFromDate(maxDate)}" name="checkout" />
          </div>
          <div>
            <label for="max-price">Макс. цена суток</label>
            <input id="max-price" type="text" value="" name="price" class="max-price" />
          </div>
          <div>
            <div><button type="submit">Найти</button></div>
          </div>
        </div>
      </fieldset>
    </form>
    `
  )

  document.querySelector('form#searchForm').addEventListener('submit', getSearchFormData)
}

function getSearchFormData(e: Event): void { 
  e.preventDefault();

  const form = new FormData(document.querySelector('form#searchForm'))

  const searchFormData: IFindPlacesParams = {
    city: form.get('city').toString(),
    coordinates: form.get('coordinates').toString(),
    checkInDate: getDateFromString(form.get('check-in-date').toString()).getTime(),
    checkOutDate: getDateFromString(form.get('check-out-date').toString()).getTime(),
  }

  const formPrice = parseInt(form.get('price').toString());

  isNaN(formPrice) || formPrice < 1 ? null : searchFormData.maxPrice = formPrice

  const homy = form.getAll('provider').indexOf('homy') !== -1 ? true : false
  const flatRent = form.getAll('provider').indexOf('flat-rent') !== -1 ? true : false
  
  search(searchFormData, renderSearchResultsBlock, homy, flatRent)
}

export function search(params: IFindPlacesParams, render: (places: IPlaces[] | Record<string, string> | Error) => void, homy: boolean, flatRent: boolean): void { 
  let allPlaces: IPlaces[] = [];

  if (flatRent) { 
    const flats = new FlatRentSdk();
    const parameters: IFindFlatParams = {
      city: params.city,
      checkInDate: new Date(params.checkInDate),
      checkOutDate: new Date(params.checkOutDate),
    }

    params.maxPrice ? parameters.priceLimit = params.maxPrice : null

    flats.search(parameters).then(result => { 
      
      if (!Array.isArray(result)) {
        render(result);
      } else { 
        const places: IPlaces[] = result.map(flat => ({
          id: flat.id,
          image: flat.photos[0],
          name:	flat.title,
          description:	flat.details,
          remoteness:	null,
          bookedDates: flat.bookedDates.map(bookDate => bookDate.getTime()),
          price: flat.totalPrice
        }))
        allPlaces = [...allPlaces, ...places]
        render(allPlaces)
      }
    }).catch(err => render(err))
  }

  if (homy) { 
    delete params.city
    fetchHomeApi({
      method: 'GET',
      endPoint: '/places',
      parameters: params
    }).then((places) => {
      if (Array.isArray(places)) {
        allPlaces = [...allPlaces, ...places]
        render(allPlaces)
      } else { 
        render(places)
      }
    });
  }
}
