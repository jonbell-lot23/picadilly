import Head from "next/head";
import styles from "../styles/Home.module.css";
import PhotoAlbum from "react-photo-album";

const importAll = (context) => {
  return context.keys().map((key) => {
    // Retrieve the URL of the image
    const imageUrl = context(key);
    const src = typeof imageUrl === "string" ? imageUrl : imageUrl.default;

    return {
      src,
      width: 1, // Assign a width aspect (change as needed)
      height: 1, // Assign a height aspect (change as needed)
    };
  });
};

const photos = importAll(
  require.context("../public/gallery/", false, /\.(png|jpe?g|gif)$/)
);

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Picadilly</title>
      </Head>

      <PhotoAlbum
        layout="masonry"
        photos={photos.map((photo) => ({
          ...photo,
          src: photo.src.replace("/_next/static/media/", "/"),
        }))}
        columns={(containerWidth) => {
          if (containerWidth < 500) return 2;
          if (containerWidth < 900) return 3;
          return 4;
        }}
      />
    </div>
  );
}
