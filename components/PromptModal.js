import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import { Fragment } from "react";
import toast from "react-hot-toast";

const PromptModal = ({
  setPromptModal,
  promptModal,
  setTweetId,
  tweedId,
  setTweets,
  tweets,
}) => {
  const onCloseHandler = () => {
    setPromptModal(false);
    setTweetId("");
  };

  const onTweetDelete = async () => {
    if (tweedId === "") return;

    await axios.delete(`/api/tweet/`, {
      data: {
        _id: tweedId,
      },
    });

    const updatedTweets = tweets.filter((tweet) => tweet._id !== tweedId);

    setTweets(updatedTweets);

    setPromptModal(false);
    toast("Your tweet has been deleted!");
  };

  return (
    <Transition.Root show={promptModal} as={Fragment}>
      <Dialog
        as='div'
        className='fixed z-50 inset-0 select-none'
        onClose={onCloseHandler}
      >
        <div className='flex items-center justify-center min-h-[800px] sm:min-h-screen px-4 pb-20 text-center sm:block sm:p-0'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0 bg-[#5b7083] bg-opacity-40 transition-opacity'></Dialog.Overlay>
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            enterTo='opacity-100 translate-y-0 sm:scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 translate-y-0 sm:scale-100'
            leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
          >
            <div className='bg-mainBg rounded-2xl text-left overflow-hidden shadow-xl transform transition-all fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 py-8 px-8 w-[320px] max-w-[600px]'>
              <div className='flex flex-col'>
                <h4 className='text-mainWhite text-xl font-semibold'>
                  Delete Tweet?
                </h4>
                <p className='text-textGray text-base mt-2'>
                  This cannot be undone and it will be removed from your
                  profile, the timeline of any accounts that follow you, and
                  from Twitter search results.
                </p>

                <button
                  onClick={onTweetDelete}
                  className='bg-twitterRed hover:bg-twitterRed/90 text-mainWhite rounded-full py-2 mt-6 font-semibold transition-colors duration-200 ease-in-out'
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setTweetId("");
                    setPromptModal(false);
                  }}
                  className='rounded-full py-2 mt-3 font-semibold text-mainWhite border border-textGray hover:bg-white/10 transition-colors duration-200 ease-in-out'
                >
                  Cancel
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default PromptModal;
