const fs = require('node:fs');
const { createHash } = require('node:crypto');
const assets = {};
const badges = [
  { id: 'netease', file: 'netease-logo.png', mime: 'image/png', color: '#c5222b', width: 306, height: 306, crop: '0 0 306 306' },
  { id: 'caitong', file: 'caitong-logo.png', mime: 'image/png', color: '#f9c500', width: 2172, height: 1645, crop: '0 0 2172 1645' },
];
for (const b of badges) {
  const data = fs.readFileSync(`public/badges/${b.file}`).toString('base64');
  // Preserve the complete source logo, including Chinese and English lettering.
  const [x, y, width, height] = b.crop.split(' ');
  // Keep current mark sizes and center them in the upper-middle card area.
  const logoWidth = 560;
  const logoHeight = 500;
  const logo = `<svg x="${(640 - logoWidth) / 2}" y="100" width="${logoWidth}" height="${logoHeight}" viewBox="${b.crop}" preserveAspectRatio="xMidYMid meet" overflow="hidden"><defs><clipPath id="mark"><rect x="${x}" y="${y}" width="${width}" height="${height}"/></clipPath></defs><image clip-path="url(#mark)" width="${b.width}" height="${b.height}" xlink:href="data:${b.mime};base64,${data}"/></svg>`;
  const card = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="640" height="966" viewBox="0 0 640 966"><rect width="640" height="966" fill="white"/>${logo}<text x="320" y="755" text-anchor="middle" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="66" font-weight="700" letter-spacing="8" fill="#202029">马景悦</text><rect x="0" y="874" width="640" height="92" fill="${b.color}"/></svg>`;
  const version = createHash('sha256').update(card).digest('hex').slice(0, 12);
  assets[b.id] = {};
  for (const face of ['front','back']) {
    fs.writeFileSync(`public/badges/${b.id}-${face}.svg`, card);
    assets[b.id][face] = `/badges/${b.id}-${face}.svg?v=${version}`;
  }
  assets[b.id].band = `/badges/${b.id}-band.svg?v=${version}`;
  fs.writeFileSync(`public/badges/${b.id}-band.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="128"><rect width="1024" height="128" fill="${b.color}"/><path d="M0 8H1024M0 120H1024" stroke="#ffffff55" stroke-width="3"/></svg>`);
}
fs.writeFileSync('src/badge-assets.json', JSON.stringify(assets, null, 2) + '\n');




