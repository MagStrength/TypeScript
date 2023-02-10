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

export function renderEmptyOrErrorSearchBlock (reasonMessage) {
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

export function renderSearchResultsBlock(places: IPlaces[] | Record<string, string> | Error): void {
  const isPlaces = Array.isArray(places)

  if (!isPlaces) {
    renderEmptyOrErrorSearchBlock(places['message']);
  } 
  if (isPlaces && places.length === 0) { 
    renderEmptyOrErrorSearchBlock('Ничего не нашлось =(');
  }
  if (isPlaces && places.length > 0) { 
    let html = `<div class="search-results-header">
                  <p>Результаты поиска</p>
                  <div class="search-results-filter">
                      <span><i class="icon icon-filter"></i> Сортировать:</span>
                      <select>
                          <option selected="">Сначала дешёвые</option>
                          <option selected="">Сначала дорогие</option>
                          <option>Сначала ближе</option>
                      </select>
                  </div>
                </div>
                  <ul class="results-list">`
    
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

    html += '</ul>'

    renderBlock(
      'search-results-block',
      html
    )

    document.querySelectorAll('.favorites').forEach(fav => { fav.addEventListener('click', toggleFavoriteItem) })
  }
}

function toggleFavoriteItem(e: Event): void {
  if (e.target instanceof HTMLDivElement) {
    const place: Pick<IPlaces, 'id' | 'image' | 'name'> = {
      id: null,
      image: null,
      name: null
    }

    place.id = e.target.id

    if (e.target.nextElementSibling instanceof HTMLImageElement) {
      place.image = e.target.nextElementSibling.src
    }

    place.name = e.target.closest('.result').querySelector('.result-info--name').textContent

    toggleFavorites(place)

    e.target.classList.toggle('active')

    renderUserBlock()
  }
}
