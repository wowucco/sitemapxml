const SitemapGenerator = require('sitemap-generator');

const parse = (url, options = {}) => {
  const generator = SitemapGenerator(url, options);

  generator.on('done', () => {
    return 'success';
  });

  generator.on('error', error => {
    throw error;
  });

  generator.start();
};

module.exports.parse = parse;
