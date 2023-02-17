import { IPlaces, IUser } from './interfaces.js'
import { renderBlock } from './lib.js'

export function renderUserBlock() {
  const userData = getUserData()
  const favoritesAmount = getFavoritesAmount()

  const favoritesCaption = favoritesAmount ? favoritesAmount : 'ничего нет'
  const hasFavoriteItems = favoritesAmount ? true : false

  renderBlock(
    'user-block',
    `
    <div class="header-container">
      <img class="avatar" src="${userData.avatarUrl}" alt="Wade Warren" />
      <div class="info">
          <p class="name">${userData.username}</p>
          <p class="fav">
            <i class="heart-icon${hasFavoriteItems ? ' active' : ''}"></i>${favoritesCaption}
          </p>
      </div>
    </div>
    `
  )
}

export function getUserData(): IUser {
  const user: unknown = JSON.parse(localStorage.getItem('user') || '')

  const emptyUser: IUser = {
    username: 'unknown',
    avatarUrl: '/img/empty.png'
  }
  
  const result: IUser = {
    username: isUser(user) ? user.username : emptyUser.username,
    avatarUrl: isUser(user) ? user.avatarUrl : emptyUser.avatarUrl
  }

  return result
}

function isUser(user: unknown): user is IUser { 
  return typeof user === 'object' && user !== null && 'username' in user && 'avatarUrl' in user
}

export function getFavoritesAmount(): number { 
  const favoriteItems = getFavorites()

  return favoriteItems.length
}

function getFavorites(): Pick<IPlaces, 'id' | 'image' | 'name'>[] { 
  const favoriteItems: unknown = JSON.parse(localStorage.getItem('favoriteItems') || '')

  if (!Array.isArray(favoriteItems) || favoriteItems.length === 0) {
    return []
  } 

  return favoriteItems
}

export function toggleFavorites(favPlace: Pick<IPlaces, 'id' | 'image' | 'name'>): void { 
  const favoriteItems = getFavorites()

  const filtredFavorites = favoriteItems.filter((fav: Pick<IPlaces, 'id' | 'image' | 'name'>) => fav.id !== favPlace.id)

  filtredFavorites.length === favoriteItems.length ? 
    localStorage.setItem('favoriteItems', JSON.stringify([...favoriteItems, favPlace])) : 
    localStorage.setItem('favoriteItems', JSON.stringify(filtredFavorites))
}


export function isFavorite(placeId: string): boolean { 
  const favoriteItems = getFavorites()

  return favoriteItems.find((fav: Pick<IPlaces, 'id' | 'image' | 'name'>) => fav.id === placeId) ? true : false
}
