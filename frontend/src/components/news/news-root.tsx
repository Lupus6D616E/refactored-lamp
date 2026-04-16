'use client'

import { createRoot } from 'react-dom/client'
import ArticlesPage from './news'

function App() {
        return(
            <ArticlesPage />
        )
}   

const root = createRoot(document.getElementById('root')!)
root.render(<App />)