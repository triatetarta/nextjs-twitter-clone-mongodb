import {
  ChartBarIcon,
  ChatIcon,
  DotsHorizontalIcon,
  HeartIcon,
  ShareIcon,
  SwitchHorizontalIcon,
  TrashIcon,
  PencilAltIcon,
} from "@heroicons/react/outline";
import {
  HeartIcon as HeartIconFilled,
  ChatIcon as ChatIconFilled,
} from "@heroicons/react/solid";
import { useRouter } from "next/router";
import { useState } from "react";
import moment from "moment";
import { useUser } from "../context/UserContext";
import axios from "axios";

const Tweet = ({
  tweet,
  tweetPage,
  setTweet,
  setModalOpen,
  setPromptModal,
  setTweetId,
}) => {
  const user = useUser();
  const { _id, postedAt, body, image, user: tweetUser, likes } = tweet;
  const [updatingLike, setUpdatingLike] = useState(false);
  const [likesState, setLikesState] = useState(likes);

  const router = useRouter();

  const likeTweet = async () => {
    setUpdatingLike(true);
    let action = likesState.includes(user.id) ? "$pull" : "$addToSet";

    await axios.put("/api/tweet/like", {
      _id,
      userId: user.id,
      action,
    });

    setLikesState((likes) => {
      if (likesState.includes(user.id)) {
        return likes.filter((like) => like !== user.id);
      }
      return [...likes, user.id];
    });
    setUpdatingLike(false);
  };

  return (
    <div
      className='p-3 flex cursor-pointer border-b border-gray-700 hover:bg-hoverGray/20 transition-colors duration-200 ease-out'
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/${_id}`);
      }}
    >
      {!tweetPage && (
        <img
          src={tweetUser?.picture}
          alt='avatar'
          className='h-11 w-11 rounded-full mr-4'
        />
      )}
      <div className='flex flex-col space-y-2 w-full'>
        <div className={`flex ${!tweetPage && "justify-between"}`}>
          {tweetPage && (
            <img
              src={tweetUser?.picture}
              alt='Profile Pic'
              className='h-11 w-11 rounded-full mr-4'
            />
          )}
          <div className='text-textGray'>
            <div className='inline-block group'>
              <h4
                className={`font-bold text-[15px] sm:text-base text-mainWhite group-hover:underline ${
                  !tweetPage && "inline-block"
                }`}
              >
                {tweetUser?.name}
              </h4>
              <span
                className={`text-sm sm:text-[15px] ${!tweetPage && "ml-1.5"}`}
              >
                @{tweetUser?.nickname}
              </span>
            </div>
            <span className='mx-2 font-bold'>·</span>
            <span className='hover:underline text-sm sm:text-[15px]'>
              {moment(postedAt).fromNow()}
            </span>
            {!tweetPage && (
              <p className='text-mainWhite text-[15px] sm:text-base mt-0.5'>
                {body}
              </p>
            )}
          </div>
          <div className='icon group flex-shrink-0 ml-auto'>
            <DotsHorizontalIcon className='h-5 text-textGray group-hover:text-primaryBlue' />
          </div>
        </div>
        {tweetPage && <p className='text-mainWhite mt-0.5 text-xl'>{body}</p>}

        {image && (
          <img
            src={image}
            alt='tweet attachment'
            className='rounded-2xl max-h-[700px] object-cover mr-2'
          />
        )}

        <div
          className={`text-textGray flex justify-between w-10/12 ${
            tweetPage && "mx-auto"
          }`}
        >
          <div className='flex items-center space-x-1 group'>
            <div className='icon group-hover:bg-primaryBlue group-hover:bg-opacity-10'>
              <ChatIcon className='h-5 group-hover:text-primaryBlue' />
            </div>
            {/* {comments.length > 0 && (
            <span className='group-hover:text-primaryBlue text-sm'>
              {comments.length}
            </span>
          )} */}
          </div>

          <div
            className='flex items-center space-x-1 group'
            onClick={(e) => {
              e.stopPropagation();
              likeTweet();
            }}
          >
            <div className='icon group-hover:bg-lightRed/10'>
              {likesState.includes(user.id) ? (
                <HeartIconFilled className='h-5 text-lightRed' />
              ) : (
                <HeartIcon className='h-5 group-hover:text-lightRed' />
              )}
            </div>
            {likesState.length > 0 && (
              <span
                className={`group-hover:text-lightRed text-sm 
                ${likesState.includes(user.id) && "text-lightRed"}
                
                `}
              >
                {likesState.length}
              </span>
            )}
          </div>

          {user?.id === tweetUser?.id ? (
            <div
              onClick={(e) => {
                e.stopPropagation();
                setModalOpen(true);
                setTweet(tweet);
              }}
              className='icon group'
            >
              <PencilAltIcon className='h-5 group-hover:text-primaryBlue' />
            </div>
          ) : (
            <div className='icon group'>
              <ChartBarIcon className='h-5 group-hover:text-primaryBlue' />
            </div>
          )}

          <div className='icon group'>
            <SwitchHorizontalIcon className='h-5 group-hover:text-lightGreen' />
          </div>

          {user?.id === tweetUser?.id ? (
            <div
              onClick={(e) => {
                e.stopPropagation();
                setTweetId(_id);
                setPromptModal(true);
              }}
              className='flex items-center space-x-1 group'
            >
              <div className='icon group-hover:bg-lightRed/10'>
                <TrashIcon className='h-5 group-hover:text-lightRed' />
              </div>
            </div>
          ) : (
            <div className='flex items-center space-x-1 group'>
              <div className='icon group-hover:bg-lightGreen/10'>
                <ShareIcon className='h-5 group-hover:text-primaryBlue' />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tweet;
