const localStorage = {
  getItem: key => typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem(key) : undefined, // eslint-disable-line no-undefined
  setItem: (key, value) => typeof window !== 'undefined' && window.localStorage ? window.localStorage.setItem(key, value) : false,
  removeItem: (key, value) => typeof window !== 'undefined' && window.localStorage ? window.localStorage.removeItem(key, value) : false,
}

export default localStorage
