import React from 'react';
import { createRoot } from 'react-dom/client';
import { createMemoryHistory, createBrowserHistory, History, Update } from 'history';
import { Router } from 'react-router-dom';
import App from './App';

const ROOT_ID = '#_carrinho-dev-Root';

interface MountOptions {
  onNavigate?: (location: { pathname: string }) => void;
  defaultHistory?: History;
  initialPath?: string;
}

const mount = (el: Element, { onNavigate, defaultHistory, initialPath }: MountOptions = {}) => {
  const history = defaultHistory || createMemoryHistory({ initialEntries: [initialPath || '/'] });

  if (onNavigate) {
    history.listen(({ location }: Update) => {
      onNavigate({ pathname: location.pathname });
    });
  }

  const root = createRoot(el);
  root.render(
    <Router navigator={history} location={history.location}>
      <App />
    </Router>
  );

  return {
    onParentNavigate: ({ pathname: nextPathname }: { pathname: string }) => {
      const { pathname } = history.location;
      if (pathname !== nextPathname) {
        history.push(nextPathname);
      }
    },
  };
};

const inDevMode = () => process.env.NODE_ENV === 'development';
const inIsolation = () => !!document.querySelector(ROOT_ID);

const rootEl = document.querySelector(ROOT_ID);
if (inDevMode() && inIsolation() && rootEl) {
  mount(rootEl, { defaultHistory: createBrowserHistory() });
}

export { mount };