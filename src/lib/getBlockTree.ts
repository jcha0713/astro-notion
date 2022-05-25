import { getBlockChildren } from './getBlockChildren';

const listTypes = new Set([
  'bulleted_list_item',
  'numbered_list_item',
  'to_do',
]);

export async function getBlockTree(id: string) {
  const blocks = await addChildrenBlocks(id);
  return blocks;
}

// A function that recursively call getBlockChildren() until there is no more children
// It returns the complete tree of notion blocks
async function addChildrenBlocks(id: string) {
  let blocks = await getBlockChildren(id);

  blocks = await Promise.all(
    blocks.map(async (block, i, blocks) => {
      const { id, type } = block;

      // This part is for checking if each block is either the first or last item of the list element(<ul> or <ol>)
      // Because Notion API only returns list item blocks without wrapping them with list element,
      // it is necessary to manually add <ul> or <ol> before the first item and corresponding closing tag after the last item of the list
      if (listTypes.has(type)) {
        // if current block is the first item of the list, add is_first property
        if (isFirst(type, i, blocks)) {
          block[type]['is_first'] = true;
        }

        // if current block is the last item of the list, add is_last property
        if (isLast(type, i, blocks)) {
          block[type]['is_last'] = true;
        }
      }

      // if the current block has children, recursively call the function again to add children array to the block.
      if (block.has_children && !block[type].children) {
        block[type]['children'] = await addChildrenBlocks(id);
      }

      return block;
    })
  );

  return blocks;
}

const isFirst = (type: string, i: number, blocks) => {
  return (
    i === 0 || // if current block is the first item
    (listTypes.has(blocks[i - 1].type) && type !== blocks[i - 1].type) || // if the previous block is a list item but not the same list type
    !listTypes.has(blocks[i - 1].type) // if the previous block is not a list item,
  ); // then return true (it is the first list item)
};

const isLast = (type: string, i: number, blocks) => {
  return (
    i === blocks.length - 1 || // if current block is the last item of blocks array
    (listTypes.has(blocks[i + 1].type) && type !== blocks[i + 1].type) || // if the next item is a list item but not the same list type
    !listTypes.has(blocks[i + 1].type) // if the next item is not a list item,
  ); // then return true (it is the last list item)
};
