const fs = require('fs');
const path = require('path');
const RSS = require('rss');
const matter = require('gray-matter');

function generateRSS(posts) {
  const siteUrl = 'https://comunica.dev/blog/';
  const feed = new RSS({
    title: 'Comunica – Blog',
    description: 'Blog posts, containing announcements or other news.',
    site_url: siteUrl
  });
  for(const p in posts){
    const [_, year, month, day] = /(?:^|\/)([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])-[^\/]*$/.exec(p);
    const date = new Date(Date.UTC(year, month, day)).toUTCString();
    const title = posts[p].data.title;
    const guid = p;
    const url = siteUrl+p.slice(11, -3)+'/';

    feed.item({
      title,
      guid,
      url,
      date
    });
  }
  return feed.xml({ indent: true })
      .replace(/<lastBuildDate>.*<\/lastBuildDate>/, '');
}

function scanDir(dirPath, extension) {
  const mdFiles = [];
  const filenames = fs.readdirSync(dirPath);
  filenames.sort();
  filenames.map(filename => {
    const filePath = path.join(dirPath, filename);
    const st = fs.statSync(filePath);
    if (st.isFile() && filePath.endsWith(extension)) {
      mdFiles.push(filePath);
    }
  })
  return mdFiles;
}

async function main() {
  const postPaths = scanDir(path.join('pages','blog'), '.md');
  const now = new Date();
  const posts = postPaths
    .map(file => fs.readFileSync(file, {encoding: 'utf-8'}))
    .map(content => matter(content, { excerpt_separator: '<!-- excerpt-end -->' }))
    .reduce((acc, content, i) => {
        acc[postPaths[i]] = content;
        return acc;
    }, {});
  const rssPath = 'public/rss-feed.xml';
  const rssXML = generateRSS(posts);
  fs.writeFileSync(rssPath, rssXML);
  console.info(`Saved RSS feed to ${rssPath}`);
}

main()
