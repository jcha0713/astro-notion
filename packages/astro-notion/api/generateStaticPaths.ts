import { getBlockTree } from './getBlockTree'

export async function generateStaticPaths(data) {
  const { results } = data;
  return await Promise.all(
    results.map(async (post) => {
      const blocks = await getBlockTree(post.id);
      const postTitle = post.properties.slug.rich_text[0].plain_text;
      return {
        params: {
          post: post.id + '-' + postTitle,
        },
        props: { blocks },
      };
    })
  );
}
