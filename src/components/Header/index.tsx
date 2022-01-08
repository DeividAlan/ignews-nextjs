import { SignInButton } from '../SignInButton';
import Image from 'next/image'
import { ActiveLink } from '../ActiveLink';

import styles from './styles.module.scss';

import logoImg from '../../../public/images/logo.svg';

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Image src={logoImg} alt="Logo" />
        <nav>
          <ActiveLink activeClassName={styles.active}  href="/">
            <a>Home</a>
          </ActiveLink>
          <ActiveLink activeClassName={styles.active} href="/posts">
            <a>Posts</a>
          </ActiveLink>
        </nav>
        <SignInButton/>
      </div>
    </header>
  );
}