import { renderSearchFormBlock } from './search-form.js';
import { renderSearchStubBlock } from './search-results.js';
import { renderUserBlock } from './user.js';
import { renderToast } from './lib.js';
import { getUserData, getFavoritesAmount, User } from './userlocalStorage.js';


const ONE_DAY = 1
const TWO_DAY = 2


window.addEventListener('DOMContentLoaded', () => {
  const user: User = getUserData()
  const favoritesAmount = getFavoritesAmount();

  const today = new Date();
  const checkIn = today.setDate(today.getDate() + ONE_DAY)
 
  const checkOut = today.setDate(today.getDate() + TWO_DAY)

  renderUserBlock('Wade Warren', './img/avatar.png', 1);
  renderUserBlock(user.userName, user.avatarUrl, favoritesAmount);
  renderSearchFormBlock(checkIn, checkOut);
  renderSearchStubBlock();
  renderToast(
    {
      text: 'Это пример уведомления. Используйте его при необходимости',
      type: 'success',
    },
    {
      name: 'Понял',
      handler: () => {
        console.log('Уведомление закрыто');
      },
    }
  );
});
