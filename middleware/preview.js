// middleware/preview.js
import Prismic from 'prismic-javascript';
import LinkResolver from '~/plugins/link-resolver.js';
import PrismicConfig from '~/prismic.config.js';

export default async function(context) {
  const { route, query, redirect, res } = context;
  
  if (route.path === '/preview') {
    const { token } = query;

    if (token) {
      const api = await Prismic.getApi(PrismicConfig.apiEndpoint);
      const url = await api.previewSession(token, LinkResolver, '/');

      const cookie = [
        `${Prismic.previewCookie}=${token}`,
        `max-age=${30 * 60 * 1000}`,
        'path=/',
      ].join('; ');

      if (process.server) {
        // Server-side
        res.setHeader('Set-Cookie', [cookie]);
      } else {
        // Client-side
        document.cookie = cookie;
      }

      redirect(302, url);
    } else {
      redirect(302, '/');
    }
  }
}