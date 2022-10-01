import { SparklesIcon } from "@heroicons/react/outline";
import Input from "./Input";
import Tweet from "./Tweet";

const Feed = ({
  tweets,
  setTweets,
  modalOpen,
  setModalOpen,
  setTweet,
  emojiModalOpen,
  setEmojiModalOpen,
  setPromptModal,
  setTweetId,
}) => {
  return (
    <div className='flex-grow border-l border-r border-gray-700 max-w-2xl sm:ml-[73px] xl:ml-[370px]'>
      <div className='text-mainWhite flex items-center sm:justify-between py-2 px-3 sticky top-0 z-50 bg-mainBg border-b border-gray-700'>
        <h2 className='text-lg sm:text-xl font-bold'>Home</h2>
        <div className='hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0 ml-auto'>
          <SparklesIcon className='h-5 text-mainWhite' />
        </div>
      </div>

      <Input
        setTweets={setTweets}
        emojiModalOpen={emojiModalOpen}
        setEmojiModalOpen={setEmojiModalOpen}
      />
      <div className='pb-72'>
        {tweets?.map((tweet) => {
          return (
            <Tweet
              setPromptModal={setPromptModal}
              key={tweet._id}
              tweet={tweet}
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              setTweet={setTweet}
              setTweetId={setTweetId}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Feed;
