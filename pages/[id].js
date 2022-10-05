import { useRouter } from "next/router";
import Head from "next/head";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import Widgets from "../components/Widgets";
import Tweet from "../components/Tweet";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import Modal from "../components/Modal";
import axios from "axios";

const TweetPage = () => {
  const [tweet, setTweet] = useState(undefined);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id === undefined) return;
    const fetchTweet = async () => {
      const res = await axios(`/api/tweet/single/${id}`);

      setTweet(res.data[0]);
      setLoading(false);
    };

    fetchTweet();
  }, [id]);

  return (
    <div>
      <Head>
        <title>
          {tweet?.user.nickname} on Twitter: &quot;{tweet?.body}&quot; Post
          title
        </title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='bg-mainBg min-h-screen flex max-w-[1500px] mx-auto'>
        <Sidebar />
        <div className='flex-grow border-l border-r border-hoverGray max-w-2xl sm:ml-[73px] xl:ml-[370px]'>
          <div className='flex items-center px-1.5 py-2 border-b border-hoverGray text-mainWhite font-semibold text-xl gap-x-4 sticky top-0 z-50 bg-mainBg'>
            <div
              className='hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0'
              onClick={() => router.push("/")}
            >
              <ArrowLeftIcon className='h-5 text-mainWhite' />
            </div>
            Tweet
          </div>

          {loading ? (
            <div className='flex items-center justify-center py-10'>
              <ClipLoader loading={loading} color='#1d9bf0' />
            </div>
          ) : (
            <>
              {tweet && (
                <Tweet
                  id={id}
                  tweet={tweet}
                  setModalOpen={setModalOpen}
                  setTweet={setTweet}
                  postPage
                />
              )}
            </>
          )}

          {/* {comments.length > 0 && (
            <div className='pb-72'>
              {comments.map((comment) => (
                <Comment
                  key={comment.id}
                  id={comment.id}
                  comment={comment.data()}
                />
              ))}
            </div>
          )} */}
        </div>
        <Widgets />

        {modalOpen && (
          <Modal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            tweet={tweet}
            setTweet={setTweet}
            setTweets={setTweets}
            postPage
          />
        )}
      </main>
    </div>
  );
};

export default TweetPage;
