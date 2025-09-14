import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { router } from './router';
import { RouterProvider } from 'react-router-dom';
import { SidebarProvider } from '@ordernary/design-system';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<SidebarProvider>
			<RouterProvider router={router} />
		</SidebarProvider>
	</StrictMode>,
);
