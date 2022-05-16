import { getBlockChildren } from './getBlockChildren';
import { getCorrectTagName } from './getCorrectTagName';
import { wrapBlocks } from './wrapBlocks';
import { wrapBlocksReduce } from './wrapBlocksReduce';

function fillRenderObj(id, type, block) {
  const textBlocks = new Set([
    'paragraph',
    'heading_1',
    'heading_2',
    'heading_3',
    'bulleted_list_item',
    'numbered_list_item',
    'quote',
    'to_do',
    'code',
    'callout',
  ]);

  const renderMethod = {
    text: function () {
      let blockObj = Object.assign({}, block);
      let textObj = blockObj[type];
      if (
        textObj.hasOwnProperty('rich_text') &&
        textObj?.rich_text.length > 1
      ) {
        textObj['hasSibling'] = true;
      }
      textObj['id'] = id;
      textObj['original_tag'] = type;
      textObj['tag'] = getCorrectTagName(type);
      return blockObj;
    },
  };

  return renderMethod['text']();
}

// Takes blockId, returns returns an array of block objects
export async function getBlockData(blockId: string) {
  // This will be filled with block objects
  // and returned at the end
  let blocksToRender = [];

  // gets the list of children(blocks) from a single blog post using blockId
  const blocks = await getBlockChildren(blockId);

  console.log(blocks);

  const childBlocks = await Promise.all(
    blocks
      .filter((block) => block.has_children)
      .map(async (block) => {
        const { id } = block;
        let children = await getBlockChildren(id);
        children = children.map((child) => {
          const { id, type } = child;
          return fillRenderObj(id, type, child);
        });
        return {
          id: id,
          children: children,
        };
      })
  );

  blocksToRender = blocks.map((block) => {
    const { id, type } = block;

    // if (block.has_children && !block[type].children) {
    //   block[type]['children'] = wrapBlocks(
    //     childBlocks.find((x) => x.id === block.id)?.children
    //   );
    //   block[type]['has_children'] = block.has_children;
    // }

    block = fillRenderObj(id, type, block);
    return block;
  });

  blocksToRender = wrapBlocks(blocksToRender);

  // console.log('from blocksToRender', blocksToRender);

  return blocksToRender;
}
