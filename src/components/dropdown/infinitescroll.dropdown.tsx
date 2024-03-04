import React, { useRef } from "react";
import { List, Spin } from "antd";
import "./style.scss";

// Define the interface for the props
interface InfiniteScrollInterface {
  options: {
    value: string;
    label: string;
    id: number;
  }[];
  loading: boolean;
  open: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  handleSelect: (value: string, id: number) => void;
}

// Define the InfiniteScroll functional component
const InfiniteScroll: React.FC<InfiniteScrollInterface> = ({
  loading,
  options,
  open,
  hasMore,
  onLoadMore,
  handleSelect,
}) => {
  // Reference to the container div for handling scrolling
  const containerRef = useRef<HTMLDivElement>(null);

  // Function to handle scrolling and trigger onLoadMore when reaching the end
  const handleScroll = () => {
    const container = containerRef.current;
    if (
      container &&
      container.scrollTop + container.clientHeight >=
        container.scrollHeight - 50 &&
      hasMore &&
      !loading
    ) {
      //REACHED THE END OF THE LIST
      onLoadMore();
    }
  };

  return open ? (
    // Render the InfiniteScroll component with a scrollable container
    <div ref={containerRef} className="scrollContainer" onScroll={handleScroll}>
      {/* List component to render options */}
      <List
        dataSource={options}
        renderItem={(item) => (
          <div
            className="listItem"
            onClick={(e) => {
              e.stopPropagation();
              handleSelect(item?.value, item?.id);
            }}
          >
            {item?.label}
          </div>
        )}
        // Customize the empty text when no data is available
        locale={{
          emptyText: <>{!loading && <p>No Data Found!</p>}</>,
        }}
        style={{ zIndex: 1000, background: "white" }}
      />
      {/* Loading spinner when loading more items */}
      {loading && (
        <Spin
          style={{ textAlign: "center", padding: "10px", display: "block" }}
        />
      )}
    </div>
  ) : null;
};

export default InfiniteScroll;
