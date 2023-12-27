import { useRouter } from "next/router";
import Image from "next/image";

export default function ImagePage() {
  const router = useRouter();
  const { date, filename } = router.query;

  // Function to import all images and return an array of filenames
  const importAll = (context) => context.keys().map((key) => key);

  // Import all images
  const imageFilenames = importAll(
    require.context("../../../public/gallery/", false, /\.(png|jpe?g|gif)$/)
  );

  // Check if there's an image that contains the date in its name
  const imageExists = imageFilenames.some((filename) =>
    filename.includes(date)
  );

  // Find the image that contains the date in its name
  const imageFile = imageFilenames.find((filename) => filename.includes(date));

  return (
    <div className="flex items-center justify-center h-screen bg-gray-800">
      {imageExists ? (
        <div
          className="flex items-center justify-center p-4 bg-white shadow-2xl"
          style={{ maxWidth: "300px", maxHeight: "300px" }}
        >
          <Image
            src={`/gallery/${imageFile}`}
            alt={filename}
            layout="fill"
            objectFit="contain"
          />
        </div>
      ) : (
        <p>Image does not exist</p>
      )}
    </div>
  );
}
