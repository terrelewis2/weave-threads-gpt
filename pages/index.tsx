import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home(): JSX.Element {
  return (
    <div className={styles.container}>
      <Head>
        <title>Weave Threads GPT</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>
          Weave <span className={styles.highlight}>Threads</span> GPT
        </h1>

        <p className={styles.description}>
          Gain insights from Twitter Threads
        </p>

        <div className={styles.grid}>
        <Link href={{
            pathname: "/tweeter/shreyas",
            query:{
              id:"shreyas",
              placeholderQuestion:"What is product management?"
            },
          }} className={styles.card}>
          <img src="/images/shreyas.jpeg" alt="Profile picture" />
            <h3>Shreyas Doshi &rarr;</h3>
            <p>Shreyas has led & scaled products at Stripe, Twitter, Google, and Yahoo. Learn all about what it takes to be a successful PM.</p>
            <br/>
            <p><b><span className={styles.highlightBold}>113</span> Threads</b></p>
          </Link>

          <Link href={{
            pathname: "/tweeter/joulee",
            query:{
              id:"joulee",
              placeholderQuestion:"How to share feedback with my manager?"
            },
          }} className={styles.card}>
          <img src="/images/julie.jpeg" alt="Profile picture" />
            <h3>Julie Zhuo &rarr;</h3>
            <p>As founder at Sundial, former VP design at Meta and author of "The Making of a Manager", Julie's threads capture all her learnings.</p>
            <br/>
            <p><b><span className={styles.highlightBold}>92</span> Threads</b></p>
          </Link>

          <Link href={{
            pathname: "/tweeter/gregisenberg",
            query:{
              id:"gregisenberg",
              placeholderQuestion:"How to build an online community?"
            },
          }} className={styles.card}>
          <img src="/images/greg.jpeg" alt="Profile picture" />
            <h3>Greg Isenberg &rarr;</h3>
            <p>Building an online community? Greg's insights on building online communities will teach you all that there is to know.</p>
            <br/>
            <p><b><span className={styles.highlightBold}>109</span> Threads</b></p>
          </Link>
          
          <Link href={{
            pathname: "/tweeter/soorajchandran_",
            query:{
              id:"soorajchandran_",
              placeholderQuestion:"How do I move to Europe with a tech job?"
            },
          }} className={styles.card}>
          <img src="/images/sooraj.jpeg" alt="Profile picture" />
            <h3>Sooraj Chandran &rarr;</h3>
            <p>Looking to pursue a tech career in Europe? Sooraj has been there and done that. Learm more from his experiences and insights.</p>
            <br/>
            <p><b><span className={styles.highlightBold}>61</span> Threads</b></p>
          </Link>

        </div>
      </main>
      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel" className={styles.logo} />
        </a>
      </footer>

      <style jsx>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
      `}</style>

      <style jsx global>{`
        
      `}</style>
    </div>
  )
}
