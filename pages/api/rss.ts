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
  const dateRegex = /\[(\d{4}-\d{2}-\d{2})\]/; // matches [2023-02-01] at the beginning of the string
  const filenameRegex = /\[(.*?)\]\s*(.*?)\./; // matches everything between the square brackets and the first dot
  const dateMatch = filename.match(dateRegex);
  console.log("dateMatch", dateMatch);
  const filenameMatch = filename.match(filenameRegex);
  const date = dateMatch ? dateMatch[1] : null;
  const parsedFilename = filenameMatch ? filenameMatch[2] : filename;
  return { date, filename: parsedFilename };
};

photos.forEach((photo) => {
  const parsedFilename = parseFilename(photo.src);
  const item = {
    title: parsedFilename.filename,
    description: `<img src="http://picadilly-jonbell-lot23.vercel.app${photo.src}" alt="${parsedFilename.filename}" />`,
    url: `http://picadilly-jonbell-lot23.vercel.app${photo.src}`,
    date: parsedFilename.date,
  };
  feed.item(item);
  console.log(item);
});

const xml = feed.xml();

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Content-Type", "application/xml");
  res.send(xml);
};
