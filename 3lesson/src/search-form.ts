import { baseURL } from './API/index.js';
import { renderBlock } from './lib.js';
import { renderSearchResultsBlock } from './search-results.js';

export function renderSearchFormBlock(
  dateArrival?: string,
  dateOfDeparture?: string
) {
  const ONE_DAY = 1;
  const TWO_DAY = 2;
  const ONE_MONTH = 1;
  const TWO_MONTH = 2;
  const LAST_MONTH_IN_YEAR = 11;

  function getDefaultDateArrivar(): string {
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + ONE_MONTH)
      .toString()
      .padStart(2, '0');
    const day = (new Date().getDate() + ONE_DAY).toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  function getDefaultDateOfDeparture(): string {
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + ONE_MONTH)
      .toString()
      .padStart(2, '0');
    const day = (new Date().getDate() + ONE_DAY + TWO_DAY)
      .toString()
      .padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  function getMinDate(): string {
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + ONE_MONTH)
      .toString()
      .padStart(2, '0');
    const day = new Date().getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  function getMaxDate() {
    const year = new Date().getFullYear();
    const nextMonth = (new Date().getMonth() + TWO_MONTH)
      .toString()
      .padStart(2, '0');

    function getLastDayNextMonth() {
      const isLastMonthInYear = new Date().getMonth() === LAST_MONTH_IN_YEAR;

      if (isLastMonthInYear) {
        /// hjkjl
      } else {
        return new Date(year, Number(nextMonth), 0);
      }
    }

    return `${year}-${nextMonth}-${getLastDayNextMonth()}`;
  }

  renderBlock(
    'search-form-block',
    `
    <form>
      <fieldset class='search-filedset'>
        <div class='row'>
          <div>
            <label for='city'>Город</label>
            <input id='city' type='text' disabled value='Санкт-Петербург' />
            <input type='hidden' disabled value='59.9386,30.3141' />
          </div>
          <!--<div class='providers'>
            <label><input type='checkbox' name='provider' value='homy' checked /> Homy</label>
            <label><input type='checkbox' name='provider' value='flat-rent' checked /> FlatRent</label>
          </div>--!>
        </div>
        <div class='row'>
          <div>
            <label for='check-in-date'>Дата заезда</label>
            <input id='check-in-date' type='date' value='${dateArrival || getDefaultDateArrivar()
    }' min='${getMinDate()}' max='${getMaxDate()}' name='checkin' />
          </div>
          <div>
            <label for='check-out-date'>Дата выезда</label>
            <input id='check-out-date' type='date' value='${dateOfDeparture || getDefaultDateOfDeparture()
    }' min='${getMinDate()}' max='${getMaxDate()}' name='checkout' />
          </div>
          <div>
            <label for='max-price'>Макс. цена суток</label>
            <input id='max-price' type='number' value='3000' name='price' class='max-price' />
          </div>
          <div>
            <div><button id='btn-search'>Найти</button></div>
          </div>
        </div>
      </fieldset>
    </form>
    `
  );
  let maxPrice = 1000;
  const maxPriceLevel = () => {
    const value = (<HTMLInputElement>document.getElementById('max-price')).valueAsNumber;
    if (!isNaN(value)) {
      return Number(value);
    }
  };

  const searchBtn = document.getElementById('btn-search');
  searchBtn.addEventListener<'click'>('click', (event: MouseEvent) => {
    event.preventDefault();
    maxPrice = maxPriceLevel();
    fetchPlaces();
  });

  const fetchPlaces = () => {
    const coordinates = '59.9386,30.3141';
    const checkInDate =
      new Date(dateArrival).getTime() ||
      new Date(getDefaultDateArrivar()).getTime();
    const checkOutDate =
      new Date(dateOfDeparture).getTime() ||
      new Date(getDefaultDateOfDeparture()).getTime();
    fetch(
      `${baseURL}places?coordinates=${coordinates}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&maxPrice=${maxPrice}`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        renderSearchResultsBlock(data);
      });
  };
}
