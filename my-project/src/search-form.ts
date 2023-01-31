import { renderBlock } from './lib.js'

export function renderSearchFormBlock (checkin: number, checkout: number) {
  
  const formatDate = (date: Date) => {
    return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2)
  }

  const userCheckin = new Date(checkin)
  const formatUserCheckin = formatDate(userCheckin)
  const userCheckout = new Date(checkout)
  const formatUserCheckout = formatDate(userCheckout)

  const today = new Date();

  const minCheckin = formatDate(today)
  const minCheckout = new Date(today.setDate(today.getDate() + 1));
  const minCheckoutDay = formatDate(minCheckout)

  const maxCheckMonth = new Date(today.setMonth(today.getMonth() + 1));
  const lastDayMaxCheckMonth = new Date(maxCheckMonth.getFullYear(), maxCheckMonth.getMonth() + 1, 0);
  const maxCheck = formatDate(lastDayMaxCheckMonth)
  
  
  renderBlock(
    'search-form-block',
    `
    <form>
      <fieldset class="search-filedset">
        <div class="row">
          <div>
            <label for="city">Город</label>
            <input id="city" type="text" disabled value="Санкт-Петербург" />
            <input type="hidden" disabled value="59.9386,30.3141" />
          </div>
          <!--<div class="providers">
            <label><input type="checkbox" name="provider" value="homy" checked /> Homy</label>
            <label><input type="checkbox" name="provider" value="flat-rent" checked /> FlatRent</label>
          </div>--!>
        </div>
        <div class="row">
        <form name="check">
          <div>
            <label for="check-in-date">Дата заезда</label>
            <input id="check-in-date" type="date" value=${formatUserCheckin} min=${minCheckin} max=${maxCheck} name="checkin" />
          </div>
          <div>
            <label for="check-out-date">Дата выезда</label>
            <input id="check-out-date" type="date" value=${formatUserCheckout} min=${minCheckoutDay} max=${maxCheck} name="checkout" />
          </div>
          </form>
          <div>
            <label for="max-price">Макс. цена суток</label>
            <input id="max-price" type="text" value="" name="price" class="max-price" />
          </div>
          <div>
            <div><button>Найти</button></div>
          </div>
        </div>
      </fieldset>
    </form>
    `
  )
}
