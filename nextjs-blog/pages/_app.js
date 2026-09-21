// Custom App component — wraps every page in the Next.js app
// Import global CSS here so it applies site-wide (only works in _app.js)
import '../styles/global.css';

// Component = the active page; pageProps = props passed into that page
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
