export const stichSearchParam = (pathname: string, searchParameter: Record<string, string>) => {
  const urlSearchParams = new URLSearchParams();

  for (const key in searchParameter) {
    if (searchParameter[key]) {
      urlSearchParams.set(key, searchParameter[key]);
    }
  }

  return pathname + (urlSearchParams.size ? `?${urlSearchParams.toString()}` : '');
};