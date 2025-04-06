import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import ThemeProvider from './ThemeProvider'
import AppRoutes from './Routes'
import { store } from './store/store'

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <AppRoutes />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  )
}

export default App