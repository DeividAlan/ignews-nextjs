import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Head from 'next/head';
import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom'
import { getPrismicClient } from '../../../services/prismic';

import styles from '../post.module.scss';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

interface PostPreviewProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updateAt: string;
  }
};

interface PropsResponse {
  title: string,
  content: string[],
  last_publication_date: string,
}

const PostPreview: NextPage<PostPreviewProps> = ({ post }) => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`);
    }

  }, [session, post.slug, router]);

  return (
    post ?
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updateAt}</time>
          <div
            className={`${styles.postContent} ${styles.previewContent}`} 
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a>Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </> :
    <></>
  );
}

export default PostPreview;

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as any;
  let post = null;

  const prismic = getPrismicClient();

  try {
    const response = await prismic.getByUID<PropsResponse>('post', String(slug), {});

    post = {
      slug,
      title: RichText.asText(response.data.title),
      content: RichText.asHtml(response.data.content.splice(0, 3)),
      updateAt: new Date(response.last_publication_date as string).toLocaleDateString(
        'pt-BR', 
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }
      )
    };    


  } catch (error) {
    console.log(`Error: ${error}`);
  }


  return {
    props: {
      post,
    },
    redirect: 60 * 30, // 30 minuts
  };
}
