import Trending from "./Trending";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import Search from "./Search";
import axios from "axios";

const Widgets = ({ setTweets, setSearchLoading }) => {
  const [loadingFollows, setLoadingFollows] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [activeElement, setActiveElement] = useState(false);
  const [trendingResults, setTrendingResults] = useState([]);
  const [followResults, setFollowResults] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await axios("https://randomuser.me/api/?results=3");

      setFollowResults(data.results);

      setLoadingFollows(false);
    };

    fetchUsers();

    const fetchNews = async () => {
      const { data } = await axios(
        `https://newsdata.io/api/1/news?apikey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}&country=gb&domain=ctvnews_london`
      );

      setTrendingResults(data.results);

      setLoadingTrending(false);
    };

    fetchNews();
  }, []);

  return (
    <div className='hidden lg:inline ml-8 md:w-[600px] py-1 relative'>
      <Search
        setTweets={setTweets}
        setActiveElement={setActiveElement}
        setSearchLoading={setSearchLoading}
      />

      <div className='text-mainWhite mt-6 space-y-3 bg-widgetBg pt-2 rounded-xl w-11/12 xl:w-9/12'>
        {loadingTrending ? (
          <div className='flex items-center justify-center py-20'>
            <ClipLoader loading={loadingTrending} color='#1d9bf0' />
          </div>
        ) : (
          <>
            <h4 className='font-bold text-xl px-4'>{`What's happening`}</h4>
            {trendingResults?.slice(0, 3).map((result, index) => (
              <Trending key={index} result={result} />
            ))}
            <button className='hover:bg-mainWhite hover:bg-opacity-[0.03] px-4 py-3 cursor-pointer transition duration-200 ease-out flex items-center justify-between w-full text-primaryBlue font-light'>
              Show more
            </button>
          </>
        )}
      </div>

      <div className='text-mainWhite mt-6 space-y-3 bg-widgetBg pt-2 rounded-xl w-11/12 xl:w-9/12'>
        {loadingFollows ? (
          <div className='flex items-center justify-center py-20'>
            <ClipLoader loading={loadingFollows} color='#1d9bf0' />
          </div>
        ) : (
          <>
            <h4 className='font-bold text-xl px-4'>You might like</h4>
            {followResults?.map((result, index) => (
              <div
                className='hover:bg-mainWhite hover:bg-opacity-[0.03] px-4 py-2 cursor-pointer transition duration-200 ease-out flex items-center'
                key={index}
              >
                <Image
                  src={result.picture.thumbnail}
                  width={40}
                  height={40}
                  objectFit='cover'
                  className='rounded-full'
                />
                <div className='ml-4 leading-5 group'>
                  <h4 className='font-bold text-base group-hover:underline truncate'>
                    {result.name.first} {result.name.last}
                  </h4>
                  <h5 className='text-gray-500 text-[15px]'>
                    @{result.login.username}
                  </h5>
                </div>
                <button className='ml-auto bg-mainWhite text-widgetBg rounded-full font-bold text-sm py-1.5 px-3.5'>
                  Follow
                </button>
              </div>
            ))}
            <button className='hover:bg-mainWhite hover:bg-opacity-[0.03] px-4 py-3 cursor-pointer transition duration-200 ease-out flex items-center justify-between w-full text-primaryBlue font-light'>
              Show more
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Widgets;
