import { getNotionClient } from './notionClient';

export async function getBlockChildren(blockId: string) {
  try {
    // get notion client object
    const notion = getNotionClient();

    // get a list of children blocks from a block using blockId
    // rename results to blocks
    // and return the blocks
    const { results: blocks, next_cursor } = await notion.blocks.children.list({
      block_id: blockId,
    });
    return blocks;
  } catch (error) {
    console.error(error);
  }
}
