import { renderBlock } from './lib.js'
import { IFindPlacesParams, IPlaces } from './interfaces.js'
import { renderSearchResultsBlock } from './search-results.js'
import { FindPlaces } from './classes.js'

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

  document.querySelector('form#searchForm')?.addEventListener('submit', getSearchFormData)
}

function getSearchFormData(e: Event): void { 
  e.preventDefault();

  const formHTML = document.querySelector('form#searchForm') as HTMLFormElement

  if (formHTML) {
    const form = new FormData(formHTML)

    const city = form.get('city')?.toString()
    const coordinates = form.get('coordinates')?.toString()
    const checkInDate = form.get('check-in-date')?.toString()
    const checkOutDate = form.get('check-out-date')?.toString()
    const price = form.get('price')?.toString()

    const searchFormData: IFindPlacesParams = {
      city: city,
      coordinates: coordinates,
      checkInDate: checkInDate ? getDateFromString(checkInDate).getTime() : 0,
      checkOutDate: checkOutDate ? getDateFromString(checkOutDate).getTime() : 0,
    }

    const formPrice = typeof price === 'string' ? parseInt(price) : 0;

    isNaN(formPrice) || formPrice < 1 ? null : searchFormData.maxPrice = formPrice

    const homy = form.getAll('provider').indexOf('homy') !== -1 ? true : false
    const flatRent = form.getAll('provider').indexOf('flat-rent') !== -1 ? true : false
  
    search(searchFormData, renderSearchResultsBlock, homy, flatRent)
  }
}

export async function search(params: IFindPlacesParams, render: (places: IPlaces[]) => void, homy: boolean, flatRent: boolean): Promise<void> { 
  render(await FindPlaces.findPlaces(params, homy, flatRent))
}
