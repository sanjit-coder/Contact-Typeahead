import { FC, useEffect, useState, useCallback } from "react";
import ResultString from "../../../components/content/result.content";
import Heading from "../../../components/heading/basic.heading";
import Pagination from "../../../components/pagination/basic.pagination";
import { PAGINATION_LIMIT } from "../../../constants/app.constants";
import { PaginateDataType, UrlType } from "../../../interface/common";
import { listProducts } from "../../../services/products";
import { listContacts } from "../../../services/contacts";
import { getQueryFromUrl } from "../../../utils/common.utils";
import ProductsTable from "./components/products.table";
import Search from "../../../components/input/search.input";
import { useDebouncedEffect } from "../../../hooks/debounce/useDebouncedEffect";
import { useNavigate, useLocation } from "react-router-dom";
import { navigateToProducts } from "../../../utils/common.utils";

const fixedListParams = {
  paginate: "True",
};

const ProductList: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoding] = useState<boolean>(false);
  const [contactsLoading, setContactsLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginateDataType>({
    next: null,
    prev: null,
    count: null,
    resultsCount: 0,
    offset: null,
    hasOffset: true,
    limit: PAGINATION_LIMIT,
  });
  const [paginationSearch, setPaginationSearch] = useState<any>({
    next: null,
    prev: null,
    count: null,
    resultsCount: 0,
  });
  const [searchValue, setSearchValue] = useState<any>(null);
  const [options, setOptions] = useState<
    { value: string; label: string; id: number }[]
  >([]);
  const [selectedValue, setSelectedValue] = useState<string>("");

  useEffect(() => {
    init();
  }, [location.search]);

  const init = async () => {
    if (location?.search !== "") {
      const queryParams = getQueryFromUrl(window.location.href);
      loadProducts(queryParams);
    } else {
      loadProducts();
    }
  };

  const loadProducts = async (queryParams?: Record<string, any>) => {
    let query = queryParams || {};
    setLoding(true);
    try {
      const res = await listProducts({
        query: { ...fixedListParams, ...query },
      });

      setProducts(res.data.results);
      setPagination((prev) => {
        return {
          ...prev,
          next: res.data.next,
          prev: res.data.previous,
          count: res.data.count,
          resultsCount: res.data.results.length,
          offset: query?.offset ? Number(query.offset) : null,
        };
      });
    } catch (err) {
      console.log(err);
    }
    setLoding(false);
  };

  const handleNext = (next: UrlType) => {
    if (next === null) {
      return;
    }
    let query = getQueryFromUrl(next);
    navigateToProducts(navigate, query);
  };

  const handlePrev = (prev: UrlType) => {
    if (prev === null) {
      return;
    }
    let query = getQueryFromUrl(prev);
    navigateToProducts(navigate, query);
  };

  useDebouncedEffect({
    effect: () => (selectedValue === "" ? handleSearch() : null),
    deps: [searchValue],
    delay: 500,
  });

  const loadContactsList = async (
    queryParams?: Record<string, any>,
    loadMoreState?: boolean
  ) => {
    let query = queryParams || {};
    setContactsLoading(true);
    if (!loadMoreState) {
      setOptions([]);
    }
    try {
      const res = await listContacts({
        query: { ...fixedListParams, ...query },
      });
      const results = res?.data?.results;

      setPaginationSearch((prev: any) => {
        return {
          ...prev,
          next: res.data.next,
          prev: res.data.previous,
          count: res.data.count,
        };
      });

      setContactsLoading(false);
      const dropdownoptions = results
        .filter(
          (item: any) =>
            item?.company_name !== "" && item?.company_name !== null
        )
        .map((item: any) => ({
          label: item?.company_name,
          value: item?.company_name,
          id: parseInt(item?.id),
        }));

      setOptions((prevOptions) => [...prevOptions, ...dropdownoptions]);
    } catch (err) {
      setContactsLoading(false);
    }
  };
  const handleSearch = async (isFocus?: boolean) => {
    if (isFocus) {
      loadContactsList();
    } else {
      if (searchValue) {
        if (searchValue !== "") {
          loadContactsList({ search: searchValue });
        } else {
          loadContactsList();
        }
      }
    }
  };

  const onLoadMore = () => {
    let query = getQueryFromUrl(paginationSearch?.next);
    loadContactsList(query, true);
  };

  const handleReset = () => {
    setSearchValue("");
    setOptions([]);
    setSelectedValue("");
    navigate("/products");
  };

  const handleSelect = (value: any, id: number) => {
    setSelectedValue(value);
    navigate(`/products?contact=${id}`);
  };

  return (
    <>
      <div style={{ marginBottom: "1rem" }}>
        <Heading titleLevel={2}>Products</Heading>
      </div>
      <div
        style={{
          backgroundColor: "white",
          padding: "0.5rem",
        }}
      >
        <div
          style={{
            padding: "1rem 0rem",
            display: "flex",
            gap: "2rem",
          }}
        >
          <Search
            placeholder="Search by Name/SKU"
            handleSearch={handleSearch}
            searchValue={searchValue}
            onChange={(value) => {
              setSearchValue(value);
            }}
            options={options}
            loading={contactsLoading}
            hasMore={paginationSearch?.next !== null}
            onLoadMore={onLoadMore}
            handleReset={() => {
              handleReset();
            }}
            handleClick={(value, id) => handleSelect(value, id)}
            selectedValue={selectedValue}
          />
          {/* <Button>Reset</Button> */}
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <ResultString
                loading={loading}
                pagination={pagination}
                pageString={"product"}
              />
            </div>
            <div>
              <Pagination
                next={pagination.next}
                prev={pagination.prev}
                onNextClick={handleNext}
                onPrevClick={handlePrev}
              />
            </div>
          </div>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <ProductsTable list={products} loading={loading} />
        </div>
        <div>
          <Pagination
            next={pagination.next}
            prev={pagination.prev}
            onNextClick={handleNext}
            onPrevClick={handlePrev}
          />
        </div>
      </div>
    </>
  );
};

export default ProductList;
