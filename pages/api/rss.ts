import { NextApiRequest, NextApiResponse } from "next";
import rss from "rss";
const url = require("url");
const hostname = url.parse(req.headers.host).hostname;

const importAll = (context) =>
  context.keys().map((key) => context(key).default);
const photos = importAll(
  require.context("../../public/gallery/", false, /\.png$/)
).reverse();

console.log(photos);

const feed = new rss({
  title: "Picadilly",
  feed_url: "http://example.com/rss.xml",
  site_url: "http://example.com",
});

photos.forEach((photo) => {
  const item = {
    title: photo.src,
    description: `<img src="http://${hostname}${photo.src}" />`,
    url: photo.src, // Link to the photo
  };
  feed.item(item);
  console.log(item);
});

const xml = feed.xml();

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Content-Type", "application/xml");
  res.send(xml);
};
