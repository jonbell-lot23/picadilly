import { NextApiRequest, NextApiResponse } from "next";
import rss from "rss";

const importAll = (context) =>
  context.keys().map((key) => context(key).default);
const photos = importAll(
  require.context("../../public/gallery/", false, /\.png$/)
);

console.log(photos);

const feed = new rss({
  title: "Picadilly",
  feed_url: "http://picadilly.vercel.app/api/rss",
  site_url: "http://picadilly.vercel.app",
});

const parseFilename = (filename) => {
  const dateRegex = /\[(\d{4}-\d{2}-\d{2})\]/;
  const filenameRegex = /\[(.*?)\]\s*(.*?)\./;
  const dateMatch = filename.match(dateRegex);
  console.log("dateMatch", dateMatch);
  const filenameMatch = filename.match(filenameRegex);
  const date = dateMatch ? dateMatch[1] : null;
  const parsedFilename = filenameMatch ? filenameMatch[2] : filename;
  return { date, filename: parsedFilename };
};

let previousFilename = '';

photos
  .map((photo) => {
    const parsedFilename = parseFilename(photo.src);
    return {
      src: photo.src,
      date: parsedFilename.date,
      filename: parsedFilename.filename,
    };
  })
  .sort((a, b) => {
    if (a.date > b.date) {
      return -1;
    } else if (a.date < b.date) {
      return 1;
    } else {
      return 0;
    }
  })
  .forEach((photo) => {
    if (photo.filename !== previousFilename) {
      const item = {
        title: photo.filename,
        description: `<img src="http://picadilly-jonbell-lot23.vercel.app${photo.src}" alt="${photo.filename}" />`,
        url: `http://picadilly-jonbell-lot23.vercel.app${photo.src}`,
        date: photo.date,
      };
      feed.item(item);
      console.log(item);
      previousFilename = photo.filename;
    }
  });

const xml = feed.xml();

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Content-Type", "application/xml");
  res.send(xml);
};
