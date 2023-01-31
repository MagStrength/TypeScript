import { renderSearchFormBlock } from './search-form.js';
import { renderSearchStubBlock } from './search-results.js';
import { renderUserBlock } from './user.js';
import { renderToast } from './lib.js';

window.addEventListener('DOMContentLoaded', () => {
  const today = new Date();
  const checkIn = today.setDate(today.getDate() + 1)
 
  const checkOut = today.setDate(today.getDate() + 2)

  renderUserBlock('Wade Warren', './img/avatar.png', 1);
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
