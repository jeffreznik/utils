import createHistory from 'history/createBrowserHistory'

const history = typeof window === 'undefined' ? null : createHistory()

export default history
