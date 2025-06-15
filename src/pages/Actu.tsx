import { useEffect, useState } from 'react';
import { sanityClient } from '../lib/sanityClient.ts';
import PostCard from '../features/Post/PostCard.tsx';
import type { Post } from '../entity/post.ts';
import type { SanityDocument } from '@sanity/client';
import { Link } from 'wouter';

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt, author}`;

const Actu = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    sanityClient.fetch<SanityDocument<Post>[]>(POSTS_QUERY).then((data) => setPosts(data));
  }, []);

  return (
    <ul className={'md:max-w-2/3 mx-auto'}>
      {posts.map((post, index) => (
        <li key={index}>
          <Link className={'post'} to={'/' + post.slug.current}>
            <PostCard post={post} />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Actu;
