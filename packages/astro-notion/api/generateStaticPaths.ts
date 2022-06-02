import { getBlockTree } from './getBlockTree';

export async function generateStaticPaths(data) {
  const { results } = data;
  return await Promise.all(
    results.map(async (pageData) => {
      const blocks = await getBlockTree(pageData.id);
      const pageTitle = pageData.url.split('/').at(-1);
      return {
        params: {
          post: pageTitle,
        },
        props: { pages: results, pageData, blocks },
      };
    })
  );
}
