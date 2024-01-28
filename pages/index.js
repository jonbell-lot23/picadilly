import Head from "next/head";
import styles from "../styles/Home.module.css";

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

      <div className={styles.photoGrid}>
        {photos.map((photo, index) => {
          if (
            typeof photo.src === "object" &&
            photo.src !== null &&
            typeof photo.src.src === "string"
          ) {
            return (
              <img
                key={index}
                src={photo.src.src} // Use the src directly
                alt={`Gallery image ${index + 1}`}
                className={styles.photo}
              />
            );
          } else {
            console.log(
              `Unexpected photo.src type at index ${index}:`,
              photo.src
            );
            return null;
          }
        })}
      </div>
    </div>
  );
}
