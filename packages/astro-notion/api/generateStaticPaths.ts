import { getBlockTree } from './getBlockTree';
import { getTableData } from './getTableData';

export async function generateStaticPaths() {
  const data = await getTableData();
  const sortedPosts = data.sort(
    (a, b) =>
      new Date(b.date.created).valueOf() -
      new Date(a.date.created).valueOf()
  )

  return await Promise.all(
    sortedPosts.map(async (pageData) => {
      const blocks = await getBlockTree(pageData.id);
      const [ postUrl ] = new URL(pageData.url).pathname.split('/').filter(str => str.length > 0)
      return {
        params: {
          post: postUrl,
        },
        props: { pages: data, pageData, blocks },
      };
    })
  );
}
