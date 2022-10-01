import Head from "next/head";
import { useEffect, useState } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import Widgets from "../components/Widgets";
import { useSetUser } from "../context/UserContext";
import Modal from "../components/Modal";
import PromptModal from "../components/PromptModal";
import { ClipLoader } from "react-spinners";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [tweets, setTweets] = useState([]);
  const [tweet, setTweet] = useState(undefined);
  const [tweedId, setTweetId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [promptModal, setPromptModal] = useState(false);
  const [emojiModalOpen, setEmojiModalOpen] = useState(false);
  const setUser = useSetUser();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const getUser = await fetch("/api/user");
      const getUserJson = await getUser.json();
      setUser(getUserJson);

      const getTweets = await fetch("/api/tweet");
      const getTweetsJson = await getTweets.json();

      setTweets(getTweetsJson);
      setLoading(false);
    };

    fetchData();
    /* eslint:disable-next-line */
  }, []);

  const onBackgroundClick = (e) => {
    if (e.target.classList.contains("emojiModal")) return;
    setEmojiModalOpen(false);
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <ClipLoader loading={loading} color='#1d9bf0' />;
      </div>
    );
  }
  return (
    <div>
      <Head>
        <title>Twitter Clone</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main
        onClick={onBackgroundClick}
        className='min-h-screen flex max-w-[1500px] mx-auto'
      >
        <Sidebar setModalOpen={setModalOpen} setTweet={setTweet} />
        <Feed
          tweets={tweets}
          setTweets={setTweets}
          setTweet={setTweet}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          emojiModalOpen={emojiModalOpen}
          setEmojiModalOpen={setEmojiModalOpen}
          setPromptModal={setPromptModal}
          setTweetId={setTweetId}
        />

        <Widgets />

        {modalOpen && (
          <Modal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            tweet={tweet}
            setTweet={setTweet}
            setTweets={setTweets}
          />
        )}

        {promptModal && (
          <PromptModal
            setPromptModal={setPromptModal}
            promptModal={promptModal}
            setTweetId={setTweetId}
            tweedId={tweedId}
            setTweets={setTweets}
            tweets={tweets}
          />
        )}
      </main>
    </div>
  );
}

export const getServerSideProps = withPageAuthRequired();
