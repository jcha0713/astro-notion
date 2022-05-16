import { getNotionClient } from './notionClient';

// get notion client object
const notion = getNotionClient();

export async function getBlockChildren(blockId: string) {
  try {
    // get a list of children blocks from a block using blockId
    // and return the blocks

    const blocks = [];
    let has_more_children = true;
    let cursor: string;

    while (has_more_children) {
      const { results, next_cursor, has_more } =
        await notion.blocks.children.list({
          start_cursor: cursor,
          block_id: blockId,
        });
      blocks.push(...results);

      if (!next_cursor) {
        has_more_children = false;
        cursor = next_cursor;
      }
    }
    return blocks;
  } catch (error) {
    console.error(error);
  }
}
