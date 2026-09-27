import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ContentProvider } from './content/ContentContext';
import { flushPending } from './utils/submissions';
import './styles/index.css';

// Deliver any enquiry that could not be uploaded last time (poor connection,
// cloud unreachable). Fire-and-forget: it must never delay or block the site.
flushPending().catch(() => {});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ContentProvider>
        <App />
      </ContentProvider>
    </BrowserRouter>
  </React.StrictMode>
);
