import { SearchIcon } from "@heroicons/react/outline";
import { XCircleIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";

const Search = ({ setTweets, setSearchLoading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showX, setShowX] = useState(false);
  const [activeElement, setActiveElement] = useState(false);

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(e.target.value);

    if (term.length > 2 || term.length === 0) {
      setSearchLoading(true);
      const getTweets = await fetch(`/api/tweet/${term}`);
      const getTweetsJson = await getTweets.json();

      setTweets(getTweetsJson);
      setSearchLoading(false);
    }
  };

  const onClearHandler = () => {
    setSearchTerm("");
    const fetchData = async () => {
      setSearchLoading(true);
      const getTweets = await fetch("/api/tweet");
      const getTweetsJson = await getTweets.json();
      setTweets(getTweetsJson);
      setSearchLoading(false);
    };
    fetchData();
  };

  useEffect(() => {
    if (searchTerm.length >= 1) {
      setShowX(true);
    } else if (searchTerm.length === 0) {
      setShowX(false);
    }
  }, [searchTerm]);

  return (
    <div className='sticky top-0 py-1.5 bg-mainBg z-50 w-11/12 xl:w-9/12'>
      <div className='flex items-center bg-widgetBg p-3 rounded-full relative'>
        <SearchIcon className='text-gray-500 h-5 z-50' />
        <input
          onFocus={() => setActiveElement(true)}
          onBlur={() => setActiveElement(false)}
          type='text'
          className='bg-transparent placeholder-gray-500 outline-none text-mainWhite absolute inset-0 pl-11 border border-transparent w-full focus:border-primaryBlue rounded-full focus:bg-mainBg focus:shadow-lg'
          placeholder='Search Twitter'
          value={searchTerm}
          onChange={(e) => handleSearch(e)}
        />

        {showX && (
          <XCircleIcon
            onClick={onClearHandler}
            className='h-6 w-6 text-primaryBlue ml-auto z-50 cursor-pointer'
          />
        )}
      </div>

      {activeElement && searchTerm === "" && (
        <div className='bg-mainBg w-[320px] rounded-lg z-50 border border-gray-700 absolute top-14 right-0'>
          <p className='text-textGray p-4 text-center'>
            Try searching for tweet keywords
          </p>
        </div>
      )}
    </div>
  );
};

export default Search;
