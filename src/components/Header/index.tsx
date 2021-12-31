import styles from './styles.module.scss';
import Image from 'next/image'

import logoImg from '../../../public/images/logo.svg';

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Image src={logoImg} alt="Logo" />
        <nav>
          <a className={styles.active} href="">Home</a>
          <a href="">Posts</a>
        </nav>
      </div>
    </header>
  );
}