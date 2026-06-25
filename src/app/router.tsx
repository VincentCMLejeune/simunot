import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/home/Home.tsx'

export const router = createBrowserRouter([
    {
        path: '/', element: <Home />
    },
],
{ basename: '/simunot/' });