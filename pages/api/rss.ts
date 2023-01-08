import { NextApiRequest, NextApiResponse } from "next";
import rss from "rss";

const importAll = (context) =>
  context.keys().map((key) => context(key).default);
const photos = importAll(
  require.context("../../public/gallery/", false, /\.png$/)
).reverse();

const feed = new rss({
  title: "Picadilly",
  feed_url: "http://example.com/rss.xml",
  site_url: "http://example.com",
});

photos.forEach((photo) => {
  feed.item({
    title: photo.src,
    description: photo.src,
    url: photo.src, // Link to the photo
  });
});

const xml = feed.xml();

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Content-Type", "application/xml");
  res.send(xml);
};
