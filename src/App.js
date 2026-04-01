import { Routing } from "./router/Routing.jsx";
import { ThemeProvider } from "./shared/ui/theme/ThemeProvider.jsx";

function App() {

  return (
      <ThemeProvider>
          <Routing />
      </ThemeProvider>
  )
}

export default App
