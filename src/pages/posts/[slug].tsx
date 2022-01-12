import { GetServerSideProps, NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Head from 'next/head';
import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom'
import { getPrismicClient } from '../../services/prismic';

import styles from './post.module.scss';

interface PostProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updateAt: string;
  }
};

interface PropsResponse {
  title: string,
  content: string,
  last_publication_date: string,
}

const Post: NextPage<PostProps> = ({ post }) => {
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
            className={styles.postContent} 
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </> :
    <></>
  );
}

export default Post;

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const session = await getSession({ req });
  const { slug } = params as any;
  let post = null;

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const prismic = getPrismicClient(req);

  try {
    const response = await prismic.getByUID<PropsResponse>('post', String(slug), {});

    post = {
      slug,
      title: RichText.asText(response.data.title),
      content: RichText.asHtml(response.data.content),
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
    }
  };
}
