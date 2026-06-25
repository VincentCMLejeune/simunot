import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/home/Home.tsx'
import Succession from '../pages/succession/Succession.tsx'

export const router = createBrowserRouter([
    {
        path: '/', element: <Home />
    },
    {
        path: '/succession', element: <Succession />
    },
],
{ basename: '/simunot/' });