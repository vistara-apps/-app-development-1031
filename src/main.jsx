import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import App from './App'

const theme = createTheme({
  typography: {
    fontFamily: ['Arial', 'sans-serif'].join(','),
    fontSize: 16,
  },
  palette: {
    primary: {
      main: '#3F51B5', // Accessible blue
    },
    secondary: {
      main: '#F50057', // Complementary color
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)