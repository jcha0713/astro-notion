import { getBlockTree } from './getBlockTree';
import { getTableData } from './getTableData';

export async function generateStaticPaths() {
  const { results } = await getTableData();

  // console.log(results);

  return await Promise.all(
    results.map(async (pageData) => {
      const blocks = await getBlockTree(pageData.id);
      const postUrl = pageData.url.split('/').at(-1);
      return {
        params: {
          post: postUrl,
        },
        props: { pages: results, pageData, blocks },
      };
    })
  );
}
