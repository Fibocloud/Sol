import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";

const useSearch = (
  key = "q"
): [string, (e: ChangeEvent<HTMLInputElement>) => void] => {
  const router = useRouter();
  const q = router.query[key];
  const [keyword, setKeyword] = useState(typeof q === "string" ? q : "");
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, q: e.target.value },
      },
      undefined,
      {
        shallow: true,
      }
    );
    setKeyword(e.target.value);
  };
  return [keyword, handleChange];
};

export default useSearch;
