import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/app/router'
import * as Sentry from '@sentry/react';
import '@/shared/styles/global.scss'

Sentry.init({
  dsn: "https://9539d4e9223fd74e5e9649c2728e6f41@o4506958412644352.ingest.us.sentry.io/4510321533059072",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true
});


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
