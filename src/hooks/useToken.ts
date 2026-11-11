import { useEffect, useState } from "react";

export const useToken = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const jwt = params.get("token");
    if (jwt) {
      setToken(jwt);
      // TODO: UNCOMMENT THIS WHEN GOING INTO PRODUCTION
      // window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return token;
};
