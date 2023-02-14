import { IPlaces, IRequestParams } from './interfaces.js'
import { HOMY_API_URL } from './constants.js'

export function renderBlock (elementId, html) {
  const element = document.getElementById(elementId)
  element.innerHTML = html
}

export function renderToast (message, action) {
  let messageText = ''
  
  if (message != null) {
    messageText = `
      <div id="info-block" class="info-block ${message.type}">
        <p>${message.text}</p>
        <button id="toast-main-action">${action?.name || 'Закрыть'}</button>
      </div>
    `
  }
  
  renderBlock(
    'toast-block',
    messageText
  )

  const button = document.getElementById('toast-main-action')
  if (button != null) {
    button.onclick = function() {
      if (action != null && action.handler != null) {
        action.handler()
      }
      renderToast(null, null)
    }
  }
}

export async function fetchHomeApi(requestParams: IRequestParams): Promise<IPlaces[] |  Record<string, string>> {
  if (requestParams.method === 'GET') {
    const fetchURL = HOMY_API_URL + requestParams.endPoint + serializeToGetParams(requestParams.parameters)
    const response = await fetch(fetchURL)
    return await response.json()
  } else { 
    const fetchURL = HOMY_API_URL + requestParams.endPoint
    const response = await fetch(fetchURL, {
      method: requestParams.method,
      body: JSON.stringify(requestParams.parameters)
    })
    return await response.json()
  }
}

export function serializeToGetParams(params: object): string { 
  return '?' + Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
}

