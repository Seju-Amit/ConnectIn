// import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "../styles/Home.module.css";
import Router from "next/router";
import { useRouter } from "next/router";
import UserLayout from '@layout/UserLayout'

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <UserLayout>

      <div className={styles.container}>

        <div className={styles.mainContainer}>

          <div className={styles.mainContainer_Left}>

            <p>Connect with Friends without Exaggeration</p>

            <p>A true Social media platform, with stories no blufs !</p>

            <div 
            onClick={()=>{
              Router.push('/login')
            }}
            className="buttonJoin">
              <p>Join Now</p>
            </div>

          </div>

          <div className={styles.minContainer_right}>
            <Image
              src="/images/hero.jpg"
              alt="Picture of the author"
              width={500}
              height={500}
            />
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
