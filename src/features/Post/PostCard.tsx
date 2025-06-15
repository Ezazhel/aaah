import './post.css';
import type { Post } from '../../entity/post.ts';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <>
      <img alt={'post image'} />
      <div className={'text-left space-y-2'}>
        <h2>{post.title}</h2>
        <div>{post.publishedAt}</div>
        <p>
          {`Ludum Dare Ludum DareLudum Dare Ludum DareLudum Dare Ludum DareLudum Dare Ludum DareLudum
          Dare Ludum DareLudum Dare Ludum DareLudum Dare Ludum DareLudum Dare Ludum DareLudum Dare
          Ludum DareLudum Dare Ludum DareLudum Dare Ludum Dare Ludum Dare Ludum DareLudum Dare Ludum
          DareLudum Dare Ludum DareLudum Dare Ludum DareLudum Dare Ludum DareLudum Dare Ludum
          DareLudum Dare Ludum DareLudum Dare Ludum DareLudum Dare Ludum DareLudum Dare Ludum
          DareLudum Dare Ludum Dare Ludum Dare Ludum DareLudum Dare Ludum DareLudum Dare Ludum
          DareLudum Dare Ludum DareLudum Dare Ludum DareLudum Dare Ludum DareLudum Dare Ludum
          DareLudum Dare Ludum DareLudum Dare Ludum DareLudum Dare Ludum DareLudum Dare Ludum Dare
          Ludum Dare Ludum DareLudum Dare Ludum DareLudum Dare Ludum DareLudum Dare Ludum DareLudum
          Dare Ludum DareLudum Dare Ludum DareLudum Dare Ludum DareLudum Dare Ludum DareLudum Dare
          Ludum DareLudum Dare Ludum DareLudum Dare Ludum Dare Ludum Dare Ludum DareLudum Dare Ludum
          DareLudum Dare Ludum DareLudum Dare Ludum DareLudum Dare Ludum DareLudum Dare Ludum
          DareLudum Dare Ludum DareLudum Dare Ludum DareLudum Dare Ludum DareLudum Dare Ludum
          DareLudum Dare Ludum Dare Ludum Dare Ludum DareLudum Dare Ludum DareLudum Dare Ludum
          DareLudum Dare Ludum DareLudum Dare Ludum DareLudum Dare Ludum DareLudum Dare Ludum
          DareLudum Dare Ludum DareLudum Dare Ludum DareLudum Dare Ludum DareLudum Dare Ludum Dare`
            .slice(0, 357)
            .trim() + '...'}
        </p>
      </div>
    </>
  );
};

export default PostCard;
