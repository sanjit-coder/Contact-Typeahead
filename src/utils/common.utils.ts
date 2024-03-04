export const getQueryFromUrl = (url: string) => {
  const urlObj = new URL(url);
  const query: Record<string, any> = {};
  urlObj.searchParams.forEach(function (val, key) {
    query[key] = val;
  });

  return query;
};

export const pluralize = (num: number, word: string, plural = word + "s") =>
  [1, -1].includes(Number(num)) ? word : plural;

// navigationUtil.js
export const navigateToProducts = (
  navigate: any,
  queryParams?: Record<string, any>
) => {
  const productPath = "/products";
  const queryString = queryParams
    ? Object?.keys(queryParams)
        .map((key) => `${key}=${queryParams[key]}`)
        .join("&")
    : null;

  const fullPath = queryString ? `${productPath}?${queryString}` : productPath;

  // Use navigate to navigate to the desired path
  navigate(fullPath);
};
