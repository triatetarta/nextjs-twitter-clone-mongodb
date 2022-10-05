import {
  CalendarIcon,
  ChartBarIcon,
  EmojiHappyIcon,
  PhotographIcon,
  XIcon,
} from "@heroicons/react/outline";
import { useRef, useState } from "react";
import { useUser } from "../context/UserContext";
import toast from "react-hot-toast";
import { emojiList } from "../constants/data";
import { BarLoader } from "react-spinners";
import axios from "axios";

const Input = ({ setTweets, emojiModalOpen, setEmojiModalOpen }) => {
  const user = useUser();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [emojis, setEmojis] = useState(emojiList);

  const filePickerRef = useRef(null);

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setImage(readerEvent.target.result);
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

    const signatureResponse = await axios.get(`api/image-upload/get-signature`);

    if (image !== null) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDAPIKEY);
      formData.append("timestamp", signatureResponse.data.timestamp);
      formData.append("signature", signatureResponse.data.signature);

      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDNAME}/image/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: function (e) {
            console.log(e.loaded / e.total);
          },
        }
      );

      const tweet = {
        postedAt: Date.now(),
        body: input,
        image: cloudinaryResponse.data.secure_url,
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
      setImage(null);
      toast("Your Tweet was sent.");
    } else {
      const tweet = {
        postedAt: Date.now(),
        body: input,
        image: "",
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
      toast("Your Tweet was sent.");
    }
  };

  return (
    <div
      className={`border-b border-gray-700 p-3 flex space-x-3 relative ${
        loading && "opacity-60"
      }`}
    >
      <div className='absolute top-0 left-0 right-0'>
        <BarLoader loading={loading} width='100%' color='#1d9bf0' />
      </div>
      <img
        src={user?.picture}
        alt='avatar'
        className='h-11 w-11 rounded-full cursor-pointer'
      />
      <div className='divide-y divide-gray-700 w-full'>
        <div className={`${image && "pb-7"} ${input && "space-y-2.5"}`}>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            placeholder="What's happening?"
            rows='2'
            className='bg-transparent outline-none text-mainWhite text-lg placeholder-gray-500 placeholder:font-normal tracking-wide w-full min-h-[50px]'
            style={{ resize: "none" }}
          />

          {image && (
            <div className='relative'>
              <div
                className='absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26] bg-opacity-75 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer transition-colors duration-200'
                onClick={() => setImage(null)}
              >
                <XIcon className='text-white h-5' />
              </div>
              <img
                src={image}
                alt='file preview'
                className='rounded-2xl max-h-80 object-contain'
              />
            </div>
          )}
        </div>
        {!loading && (
          <div className='flex items-center justify-between pt-2.5'>
            <div className='flex items-center space-x-1'>
              <div
                className='icon'
                onClick={() => filePickerRef.current.click()}
              >
                <PhotographIcon className='text-[#1d9bf0] h-[20px]' />
                <input
                  type='file'
                  ref={filePickerRef}
                  hidden
                  onChange={addImageToPost}
                />
              </div>

              <div className='icon rotate-90'>
                <ChartBarIcon className='text-primaryBlue h-[20px]' />
              </div>

              <div
                className='icon relative'
                onClick={(e) => {
                  e.stopPropagation();
                  emojiModalOpen
                    ? setEmojiModalOpen(false)
                    : setEmojiModalOpen(true);
                }}
              >
                <EmojiHappyIcon className='text-primaryBlue h-[20px]' />
              </div>

              <div className='icon'>
                <CalendarIcon className='text-primaryBlue h-[20px]' />
              </div>

              {emojiModalOpen && (
                <div className='emojiModal bg-mainBg absolute top-[130px] -ml-[40px] w-[280px] rounded-lg flex flex-wrap p-4 z-50 border border-gray-700'>
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
            </div>
            <button
              className='bg-primaryBlue text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-hoverBlue disabled:hover:bg-primaryBlue disabled:opacity-50 disabled:cursor-default'
              disabled={!input && !image}
              onClick={onTweetSubmit}
            >
              Tweet
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;
