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
  CheckIcon,
} from "@heroicons/react/outline";
import SidebarLink from "./SidebarLink";
import { useUser } from "../context/UserContext";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

const Sidebar = ({ setModalOpen, setTweet }) => {
  const user = useUser();
  const [showDetails, setShowDetails] = useState(false);

  const router = useRouter();

  return (
    <div className='hidden sm:flex flex-col items-center xl:items-start xl:w-[340px] p-2 fixed h-full'>
      <div
        onClick={() => router.push("/")}
        className='flex items-center justify-center w-14 h-14 hoverAnimation p-0 xl:ml-24 relative'
      >
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

      <div
        onClick={() => setShowDetails(!showDetails)}
        className='text-mainWhite flex items-center justify-center mt-auto hoverAnimation xl:ml-auto xl:-mr-5 relative'
      >
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

        {showDetails && (
          <div className='profileModal bg-mainBg w-[320px] rounded-lg flex flex-wrap flex-col py-4 z-50 border border-gray-700 absolute -top-48 left-0'>
            <div className='border-b border-gray-700 pb-4 cursor-default'>
              <div className='flex items-center justify-between px-4'>
                <div className='flex items-center'>
                  <img
                    src={user?.picture}
                    alt='avatar'
                    className='h-10 w-10 rounded-full xl:mr-2.5'
                  />
                  <div className='flex flex-col ml-3'>
                    <h3 className='font-medium'>{user?.name}</h3>
                    <h4 className='text-textGray'>@{user?.nickname}</h4>
                  </div>
                </div>
                <div>
                  <CheckIcon className='h-7 w-7 text-primaryBlue' />
                </div>
              </div>
            </div>
            <div className='flex flex-col'>
              <Link href='/profile'>
                <a className='hover:bg-hoverGray/40 transition-colors duration-300 ease-out block px-4 py-2'>
                  Profile
                </a>
              </Link>
              <Link href='/api/auth/logout'>
                <a className='hover:bg-hoverGray/40 transition-colors duration-300 ease-out block px-4 py-2'>
                  Log out @{user?.nickname}
                </a>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
