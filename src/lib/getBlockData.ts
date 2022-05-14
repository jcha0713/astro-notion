import { getBlockChildren } from './getBlockChildren';
import { getNotionClient } from './notionClient';
import { getCorrectTagName } from './getCorrectTagName';

function fillRenderObj(type, tagObj) {
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
      let textObj = Object.assign({}, tagObj);
      if (
        textObj.hasOwnProperty('rich_text') &&
        textObj?.rich_text.length > 1
      ) {
        textObj['isNested'] = true;
      }
      textObj['original_tag'] = type;
      textObj['tag'] = getCorrectTagName(type);
      return textObj;
    },
  };

  return renderMethod['text']();
}

export async function getBlockData(blockId: string) {
  const blocksToRender = [];
  const blocks = await getBlockChildren(blockId);

  blocks.forEach((block) => {
    const { type } = block;
    const renderObj = fillRenderObj(type, block[type]);
    if (renderObj) {
      blocksToRender.push(renderObj);
    }
  });

  const listTypes = new Set(['bulleted_list_item', 'numbered_list_item']);

  blocksToRender.forEach((block, i, blocksToRender) => {
    if (listTypes.has(block.original_tag)) {
      if (i === 0 || !listTypes.has(blocksToRender[i - 1].original_tag)) {
        let replaceCount = 0;
        let startIndex = i;
        const childList = [];
        const listType = block.original_tag;
        while (
          i < blocksToRender.length &&
          listTypes.has(blocksToRender[i].original_tag) &&
          blocksToRender[i].original_tag === listType
        ) {
          replaceCount += 1;
          childList.push(blocksToRender[i]);
          i += 1;
        }
        blocksToRender.splice(startIndex, replaceCount, {
          isNested: true,
          tag: block.original_tag === 'bulleted_list_item' ? 'ul' : 'ol',
          rich_text: childList,
        });
      }
    }
  });

  return blocksToRender;
}
