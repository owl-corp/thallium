import { useState, useEffect, useMemo } from "react";
import { type RefObject } from "react";

export function useVisible(ref: RefObject<HTMLElement>) {
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
        ([entry]) => { setVisible(entry.isIntersecting); }
    );

    if (ref.current)
      observer.observe(ref.current);

    return () => { observer.disconnect(); };
  }, [ref]);

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
    }

    queryObject.addEventListener("change", listenHook);

    return () => queryObject.removeEventListener("change", listenHook);
  }, [queryObject]);

  return matches;
}
