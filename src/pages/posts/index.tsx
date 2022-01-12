import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom'
import { getPrismicClient } from '../../services/prismic';
import styles from './styles.module.scss';

type Post = {
  slug: string;
  title: string;
  excerpte: string;
  updateAt: string;
};

interface PostsProps {
  posts: Post[];
};

const Posts: NextPage<PostsProps> = ({ posts }) => {
  return (
    <>
      <Head>
        <title>Post | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          { posts.map(post => (
            <Link key={post.slug} href={`/posts/preview/${post.slug}`} >
              <a>
                <time>{post.updateAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpte}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export default Posts;

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
        title: RichText.asText(post.data.title),
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