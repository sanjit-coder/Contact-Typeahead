import { FC, useState, useRef, useEffect } from "react";
import { Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import InfiniteScroll from "../dropdown/infinitescroll.dropdown";
import "./style.scss";

// Define the interface for the Search component props
interface SearchInterface {
  placeholder: string;
  handleSearch: (isFocus: boolean) => void;
  searchValue: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
    id: number;
  }[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  handleReset: () => void;
  handleClick: (value: string, id: number) => void;
  selectedValue: string;
}

// Define the Search functional component
const Search: FC<SearchInterface> = ({
  placeholder,
  handleSearch,
  searchValue,
  onChange,
  options,
  loading,
  hasMore,
  onLoadMore,
  handleReset,
  handleClick,
  selectedValue,
}) => {
  // Set a fixed height for the dropdown (adjust as needed)
  const dropdownHeight = 200;

  // Custom style for the dropdown
  const customDropdownStyle = {
    height: dropdownHeight,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  // State to control the visibility of the dropdown
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  // Reference to the search component
  const searchRef = useRef<any>(null);

  // useEffect hook to handle clicks outside the search component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click target is outside the search component
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        // Reset the search and hide the dropdown when clicking outside
        if (selectedValue === "" && showDropdown) {
          handleReset();
        }
        setShowDropdown(false);
      }
    };

    // Attach the click event listener to the document
    document.addEventListener("click", handleClickOutside);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handleReset, searchRef]);

  return (
    <>
      {/* Search component container */}
      <div ref={searchRef} className="searchParentContainer">
        {/* Search input and Reset button */}
        <div className="searchContainer">
          <Input
            value={searchValue}
            onChange={(e) => {
              if (selectedValue === "") {
                onChange(e.target.value);
              } else return;
            }}
            className="inputContainer"
            size="large"
            placeholder={placeholder}
            onFocus={() => {
              if (selectedValue === "") {
                handleSearch(true);
                setShowDropdown(true);
              } else return;
            }}
            suffix={<SearchOutlined />}
          />
          <Button
            onClick={() => {
              // Reset the search and hide the dropdown
              handleReset();
              setShowDropdown(false);
            }}
          >
            Reset
          </Button>
        </div>

        {/* InfiniteScroll dropdown for search results */}
        <InfiniteScroll
          loading={loading}
          options={options}
          open={showDropdown}
          hasMore={hasMore}
          onLoadMore={onLoadMore}
          handleSelect={(value: string, id: number) => {
            // Update the search value and hide the dropdown
            onChange(value);
            setShowDropdown(false);
            handleClick(value, id);
          }}
        />
      </div>
    </>
  );
};

export default Search;
