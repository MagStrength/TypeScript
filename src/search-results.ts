import { FindPlaces } from './classes.js'
import { IPlaces } from './interfaces.js'
import { renderBlock } from './lib.js'
import { isFavorite, renderUserBlock, toggleFavorites } from './user.js'

export function renderSearchStubBlock () {
  renderBlock(
    'search-results-block',
    `
    <div class="before-results-block">
      <img src="img/start-search.png" />
      <p>Чтобы начать поиск, заполните форму и&nbsp;нажмите "Найти"</p>
    </div>
    `
  )
}

export function renderEmptyOrErrorSearchBlock (reasonMessage: string) {
  renderBlock(
    'search-results-block',
    `
    <div class="no-results-block">
      <img src="img/no-results.png" />
      <p>${reasonMessage}</p>
    </div>
    `
  )
}

export function renderSearchResultsBlock(places: IPlaces[]): void {
  if (places.length === 0) { 
    renderEmptyOrErrorSearchBlock('Ничего не нашлось =(');
  } else { 
    let html = `<div class="search-results-header">
                  <p>Результаты поиска</p>
                  <div class="search-results-filter">
                      <span><i class="icon icon-filter"></i> Сортировать:</span>
                      <select id="searchSort">
                          <option value="">Выбрать</option>
                          <option value="price_ASC">Сначала дешёвые</option>
                          <option value="price_DESC">Сначала дорогие</option>
                          <option value="remoteness_ASC">Сначала ближе</option>
                      </select>
                  </div>
                </div>
                  <ul id="results-list" class="results-list">`
    html += '</ul>'

    renderBlock(
      'search-results-block',
      html
    )

    renderResultList(places)

    document.querySelector('#searchSort')?.addEventListener('change', (e) => sortResults(e.target, places))
  }
}

function renderResultList(places: IPlaces[]): void { 
  let html = ''

  places.map(place => {
    html += `<li class="result">
              <div class="result-container">
                <div class="result-img-container">
                  <div id="${place.id}" class="favorites ${isFavorite(place.id) && 'active'}"></div>
                  <img class="result-img" src="${place.image}" alt="">
                </div>	
                <div class="result-info">
                  <div class="result-info--header">
                    <p class="result-info--name">${place.name}</p>
                    <p class="price">${place.price}&#8381;</p>
                  </div>
                  ${place.remoteness ? `<div class="result-info--map"><i class="map-icon"></i> ${place.remoteness}км от вас </div>` : ''}
                  <div class="result-info--descr">${place.description}</div>
                  <div class="result-info--footer">
                    <div>
                      <button>Забронировать</button>
                    </div>
                  </div>
                </div>
              </div>
            </li>`
  })

  renderBlock(
    'results-list',
    html
  )

  document.querySelectorAll('.favorites').forEach(fav => { fav.addEventListener('click', toggleFavoriteItem) })
}

function toggleFavoriteItem(e: Event): void {
  if (e.target instanceof HTMLDivElement) {
    const id = e.target.id
    const image = e.target.nextElementSibling instanceof HTMLImageElement ? e.target.nextElementSibling.src : ''
    const name = e.target.closest('.result')?.querySelector('.result-info--name')?.textContent

    const place: Pick<IPlaces, 'id' | 'image' | 'name'> = {
      id: id,
      image: image,
      name: name ? name : ''
    }

    toggleFavorites(place)

    e.target.classList.toggle('active')

    renderUserBlock()
  }
}

function sortResults(select: EventTarget | null, places: IPlaces[]): void { 
  if (select instanceof HTMLSelectElement) {
    if (select.value !== '') {
      const [orderBy, orderType] = select.value.split('_')
      if ((orderBy == 'price' || orderBy == 'remoteness') && (orderType == 'ASC' || orderType == 'DESC')) {
        renderResultList(FindPlaces.sortPlaces(places, orderBy, orderType))
      }
    } 
  }
}
