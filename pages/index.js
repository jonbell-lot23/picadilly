import Head from "next/head";
import styles from "../styles/Home.module.css";
import Image from "next/image";

const importAll = (context) =>
  context.keys().map((key) => context(key).default);
const photos = importAll(
  require.context("../public/gallery/", false, /\.png$/)
).reverse();

const imgElements = photos.map((photo) => {
  return <img src={photo.src} className="w-64" />;
});

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Picadilly</title>
      </Head>
      <div className="flex flex-row flex-wrap w-full">{imgElements}</div>
    </div>
  );
}
