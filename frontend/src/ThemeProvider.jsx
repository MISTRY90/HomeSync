import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'

export default function ThemeProvider({ children }) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: 'light',
        primaryColor: 'indigo',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      <Notifications position="top-right" />
      {children}
    </MantineProvider>
  )
}