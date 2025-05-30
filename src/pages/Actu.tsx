import { useEffect, useState } from 'react';
import { sanityClient } from '../lib/sanityClient.ts';

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt}`;

const Actu = () => {
  const [posts, setPosts] = useState<{ title: string }[]>([]);

  useEffect(() => {
    sanityClient.fetch(POSTS_QUERY).then((data) => setPosts(data));
  }, []);

  return posts.map((post, index) => <div key={index}>{post.title}</div>);
};

export default Actu;
