import Image from "next/image";
import { HomeIcon } from "@heroicons/react/solid";
import {
  HashtagIcon,
  BellIcon,
  InboxIcon,
  BookmarkIcon,
  ClipboardListIcon,
  UserIcon,
  DotsCircleHorizontalIcon,
  DotsHorizontalIcon,
} from "@heroicons/react/outline";
import SidebarLink from "./SidebarLink";
import { useUser } from "../context/UserContext";

const Sidebar = ({ setModalOpen, setTweet }) => {
  const user = useUser();

  return (
    <div className='hidden sm:flex flex-col items-center xl:items-start xl:w-[340px] p-2 fixed h-full'>
      <div className='flex items-center justify-center w-14 h-14 hoverAnimation p-0 xl:ml-24 relative'>
        <Image
          src='/assets/twitter.jpg'
          width={30}
          height={30}
          objectFit='contain'
        />
      </div>
      <div className='space-y-2.5 mt-4 mb-2.5 xl:ml-24'>
        <SidebarLink text='Home' Icon={HomeIcon} active />
        <SidebarLink text='Explore' Icon={HashtagIcon} />
        <SidebarLink text='Notifications' Icon={BellIcon} />
        <SidebarLink text='Messages' Icon={InboxIcon} />
        <SidebarLink text='Bookmarks' Icon={BookmarkIcon} />
        <SidebarLink text='Lists' Icon={ClipboardListIcon} />
        <SidebarLink text='Profile' Icon={UserIcon} />
        <SidebarLink text='More' Icon={DotsCircleHorizontalIcon} />
        <SidebarLink
          text=''
          Icon={null}
          compose
          setModalOpen={setModalOpen}
          setTweet={setTweet}
        />
      </div>
      <button
        onClick={() => {
          setModalOpen(true);
          setTweet(undefined);
        }}
        className='hidden xl:inline ml-auto bg-primaryBlue text-mainWhite rounded-full w-56 h-[52px] text-lg font-bold shadow-md hover:bg-hoverBlue'
      >
        Tweet
      </button>
      <div className='text-mainWhite flex items-center justify-center mt-auto hoverAnimation xl:ml-auto xl:-mr-5'>
        <img
          src={user?.picture}
          alt='avatar'
          className='h-10 w-10 rounded-full xl:mr-2.5'
        />
        <div className='hidden xl:inline leading-5'>
          <h4 className='font-bold'>{user?.name}</h4>
          <p className='text-textGray'>@{user?.nickname}</p>
        </div>
        <DotsHorizontalIcon className='h-5 hidden xl:inline ml-10' />
      </div>
    </div>
  );
};

export default Sidebar;
