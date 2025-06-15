import { useEffect, useState } from 'react';
import type { Post } from '../../entity/post.ts';
import { sanityClient } from '../../lib/sanityClient.ts';
import type { SanityDocument } from '@sanity/client';
import { PortableText } from '@portabletext/react';

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`;

const PostDetail = ({ slug }: { slug: string }) => {
  const [post, setPost] = useState<Post>();
  useEffect(() => {
    sanityClient
      .fetch<SanityDocument<Post>>(POST_QUERY, { slug: slug })
      .then((data) => setPost(data));
  }, []);

  return (
    <>
      <div className={'text-left mx-auto max-w-prose'}>
        <PortableText value={post?.body} />
      </div>
    </>
  );
};
export default PostDetail;
