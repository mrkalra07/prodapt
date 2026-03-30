import { useCallback, useEffect, useState } from "react";

export function useFetch(fetcher, immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState("");

  const run = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await fetcher();
      setData(result);
      return result;
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Something went wrong.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    if (immediate) {
      run().catch(() => {});
    }
  }, [immediate, run]);

  return { data, loading, error, run, setData };
}
