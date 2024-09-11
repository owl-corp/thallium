import { useState, useEffect, useMemo } from "react";
import { type RefObject } from "react";

export function useVisible(ref: RefObject<HTMLElement>, initialState = false) {
  const [isVisible, setVisible] = useState(initialState);

  const intersectionObserver = useMemo(() => {
    return new IntersectionObserver(
      ([entry]) => { setVisible(entry.isIntersecting); },
      {
        threshold: 0.5
      }
    );
  }, []);


  useEffect(() => {
    if (ref.current)
      intersectionObserver.observe(ref.current);

    return () => { intersectionObserver.disconnect(); };
  }, [ref, intersectionObserver]);

  return isVisible;
}

export function useMediaQuery(query: string) {
  const queryObject = useMemo(() => {
    return window.matchMedia(query);
  }, [query]);

  const [matches, setMatches] = useState(queryObject.matches);

  useEffect(() => {
    const listenHook = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    queryObject.addEventListener("change", listenHook);

    return () => { queryObject.removeEventListener("change", listenHook); };
  }, [queryObject]);

  return matches;
}
