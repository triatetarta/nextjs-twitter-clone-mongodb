import { DotsHorizontalIcon } from "@heroicons/react/outline";
import Image from "next/image";
import moment from "moment";

const Trending = ({ result }) => {
  return (
    <div className='hover:bg-mainWhite hover:bg-opacity-[0.03] px-4 py-2 cursor-pointer transition duration-200 ease-out flex items-center justify-between'>
      <div className='space-y-0.5'>
        <p className='text-textGray text-xs font-medium'>
          <span className='capitalize'>{result.category[0]}</span>

          <span className='mx-2 font-bold'>·</span>
          {moment(result.pubDate).fromNow()}
        </p>
        <h6 className='font-bold max-w-[250px] text-sm'>{result.title}</h6>
        <p className='text-textGray text-xs font-medium max-w-[250px]'>
          Trending with{" "}
          {result.category.map((tag, index) => (
            <span className='tag' key={index}>
              #{tag}
            </span>
          ))}
        </p>
      </div>

      {result.image_url ? (
        <Image
          src={result.image_url}
          width={70}
          height={70}
          objectFit='cover'
          className='rounded-2xl'
        />
      ) : (
        <div className='icon group'>
          <DotsHorizontalIcon className='h-5 text-textGray group-hover:text-primaryBlue' />
        </div>
      )}
    </div>
  );
};

export default Trending;
