import { getNotionClient } from './notionClient';

export async function getBlockChildren(blockId: string) {
  try {
    const notion = getNotionClient();
    const { results: blocks, next_cursor } = await notion.blocks.children.list({
      block_id: blockId,
    });
    return blocks;
  } catch (error) {
    console.error(error);
  }
}
