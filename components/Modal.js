import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import {
  CalendarIcon,
  ChartBarIcon,
  EmojiHappyIcon,
  PhotographIcon,
  XIcon,
} from "@heroicons/react/outline";
import moment from "moment";
import { useUser } from "../context/UserContext";
import { emojiList } from "../constants/data";
import { BarLoader } from "react-spinners";
import toast from "react-hot-toast";
import axios from "axios";

const Modal = ({
  modalOpen,
  setModalOpen,
  tweet,
  setTweet,
  setTweets,
  postPage,
}) => {
  const user = useUser();
  const [input, setInput] = useState("");
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [emojis, setEmojis] = useState(emojiList);
  const filePickerRef = useRef(null);

  useEffect(() => {
    if (tweet === undefined) return;

    setEditText(tweet?.body);
  }, [tweet]);

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  const addEmoji = (emj) => {
    if (input !== "") {
      setInput(input + emj);
    } else {
      setInput(emj);
    }
  };

  const onTweetSubmit = async () => {
    if (loading) return;
    setLoading(true);
    const tweet = {
      postedAt: Date.now(),
      body: input,
      likes: [],
      user: {
        id: user.id,
        name: user.name,
        nickname: user.nickname,
        picture: user.picture,
      },
    };

    const { data } = await axios.post("/api/tweet", tweet);

    setTweets((tweets) => [
      {
        _id: data.insertedId,
        ...tweet,
      },
      ...tweets,
    ]);

    setLoading(false);
    setInput("");
    setModalOpen(false);
    toast("Your Tweet was sent.");
  };

  const onUpdateTweet = async () => {
    setLoading(true);
    await axios.put("/api/tweet", {
      _id: tweet._id,
      body: editText,
    });

    setTweets((tweets) =>
      tweets.map((item) => {
        if (item._id === tweet._id) {
          return {
            ...item,
            body: editText,
          };
        }

        return item;
      })
    );

    if (postPage) {
      const fetchTweet = async () => {
        const { data } = await axios(`/api/tweet/single/${tweet._id}`);

        setTweet(data[0]);
      };

      fetchTweet();
    }

    setLoading(false);
    setModalOpen(false);
    toast("Your tweet has been updated!");
  };

  const onBackgroundClick = (e) => {
    if (e.target.classList.contains("emojiModal")) return;
    setShowEmojis(false);
  };

  const onCloseHandler = () => {
    setTweet(undefined);
    setModalOpen(false);
  };

  return (
    <Transition.Root show={modalOpen} as={Fragment}>
      <Dialog
        as='div'
        className='fixed z-50 inset-0 pt-8 select-none'
        onClose={onCloseHandler}
      >
        <div className='flex items-start justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0 bg-[#5b7083] bg-opacity-40 transition-opacity'>
              {showEmojis && (
                <div className='emojiModal bg-mainBg absolute top-[300px] left-1/2 -ml-[40px] w-[280px] rounded-lg flex flex-wrap p-4 border border-gray-700 z-50 transform -translate-x-1/2'>
                  {emojis.map((emj, index) => {
                    return (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          addEmoji(emj.emoji);
                        }}
                        className='text-lg hover:bg-mainWhite/10 hover:bg-opacity-10 rounded-full cursor-pointer w-[40px] h-[40px] flex items-center justify-center'
                        key={emj.id}
                      >
                        {emj.emoji}
                      </div>
                    );
                  })}
                </div>
              )}
            </Dialog.Overlay>
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
            <div
              onClick={(e) => onBackgroundClick(e)}
              className='inline-block align-bottom bg-mainBg rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full'
            >
              <div className='flex items-center px-1.5 py-2 border-b border-hoverGray'>
                <div
                  className='hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0'
                  onClick={() => {
                    if (postPage) {
                      setModalOpen(false);
                    } else {
                      setTweet(undefined);
                      setModalOpen(false);
                    }
                  }}
                >
                  <XIcon className='h-[22px] text-mainWhite' />
                </div>
              </div>
              <div>
                <BarLoader loading={loading} width='100%' color='#1d9bf0' />
              </div>
              <div className='flex px-4 pb-2.5 sm:px-6'>
                <div className='w-full'>
                  <div className='mt-7 flex space-x-3 w-full'>
                    <img
                      src={user.picture}
                      alt='avatar'
                      className='h-11 w-11 rounded-full'
                    />
                    <div className='flex-grow mt-2'>
                      <div
                        className={`${selectedFile && "pb-7"} ${
                          input && "space-y-2.5"
                        }`}
                      >
                        {tweet !== undefined ? (
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            placeholder='Edit your tweet'
                            rows='2'
                            className='bg-transparent outline-none text-mainWhite text-lg placeholder-textGray tracking-wide w-full min-h-[80px]'
                            style={{
                              resize: "none",
                            }}
                          />
                        ) : (
                          <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="What's happening?"
                            rows='2'
                            className='bg-transparent outline-none text-mainWhite text-lg placeholder-textGray tracking-wide w-full min-h-[80px]'
                            style={{
                              resize: "none",
                            }}
                          />
                        )}

                        {selectedFile && (
                          <div className='relative'>
                            <div
                              className='absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26] bg-opacity-75 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer transition-colors duration-200'
                              onClick={() => setSelectedFile(null)}
                            >
                              <XIcon className='text-white h-5' />
                            </div>
                            <img
                              src={selectedFile}
                              alt='file preview'
                              className='rounded-2xl max-h-80 object-contain'
                            />
                          </div>
                        )}
                      </div>

                      <div className='flex items-center justify-between pt-2.5'>
                        <div className='flex items-center'>
                          <div
                            onClick={() => filePickerRef.current.click()}
                            className='icon'
                          >
                            <PhotographIcon className='text-primaryBlue h-[22px]' />
                            <input
                              type='file'
                              ref={filePickerRef}
                              hidden
                              onChange={addImageToPost}
                            />
                          </div>

                          <div className='icon rotate-90'>
                            <ChartBarIcon className='text-primaryBlue h-[22px]' />
                          </div>

                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowEmojis(!showEmojis);
                            }}
                            className='icon'
                          >
                            <EmojiHappyIcon className='text-primaryBlue h-[22px]' />
                          </div>

                          <div className='icon'>
                            <CalendarIcon className='text-primaryBlue h-[22px]' />
                          </div>
                        </div>
                        <button
                          className='bg-primaryBlue text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-hoverBlue disabled:hover:bg-primaryBlue disabled:opacity-50 disabled:cursor-default'
                          type='submit'
                          disabled={
                            loading || (editText === "" && input === "")
                          }
                          onClick={
                            tweet !== undefined ? onUpdateTweet : onTweetSubmit
                          }
                        >
                          {tweet !== undefined ? "Update" : "Tweet"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
