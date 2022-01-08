import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom'
import { getPrismicClient } from '../../services/prismic';
import styles from './styles.module.scss';

type Post = {
  slug: string;
  tittle: string;
  excerpte: string;
  updateAt: string;
};

interface PostsProps {
  posts: Post[];
};

const Post: NextPage<PostsProps> = ({ posts }) => {
  return (
    <>
      <Head>
        <title>Post | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          { posts.map(post => (
            <a key={post.slug} href="">
              <time>{post.updateAt}</time>
              <strong>{post.tittle}</strong>
              <p>{post.excerpte}</p>
            </a>
          ))}
        </div>
      </main>
    </>
  );
}

export default Post;

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  let posts;

  try {
    const response = await prismic.query([
      Prismic.predicates.at('document.type', 'post')
    ], {
      fetch: ['publication.title', 'publicate.content'],
      pageSize: 100,
    });

    posts = response.results.map((post: any) => {
      return {
        slug: post.uid,
        tittle: RichText.asText(post.data.title),
        excerpte: post.data.content.find((content: any) => 
          content.type === 'paragraph')?.text ?? '',
        updateAt: new Date(post.last_publication_date).toLocaleDateString(
          'pt-BR', 
          {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          }
        )
      };
    });

  } catch (error) {
    console.log(`Error: ${error}`);
  }

  return {
    props: { posts }
  }
}