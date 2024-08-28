import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <h1>Welcome to My Site</h1>
      <br></br>
      <Link href="/commands" className={styles.button}>
        CMDS
      </Link>
    </div>
  );
}
