import React, { useRef, useEffect } from 'react';
import { mount } from 'carrinho/App'

export default () => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      mount(ref.current, {
        initialPath: window.location.pathname,
        onNavigate: ({ pathname: nextPathname }) => {
          const { pathname } = window.location;
          if (pathname !== nextPathname) {
            window.history.pushState({}, '', nextPathname);
          }
        },
      });
    }
  }, []);

  return <div ref={ref}></div>;
}