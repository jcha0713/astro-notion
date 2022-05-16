const listTypes = new Set(['bulleted_list_item', 'numbered_list_item']);

const getTypeObj = (block) => {
  return block[block.type];
};

export function wrapBlocks(blocksToRender) {
  blocksToRender.forEach((block, i, blocksToRender) => {
    let wrapObj = {
      has_children: block.has_children,
    };
    const typeObj = getTypeObj(block);
    if (listTypes.has(typeObj.original_tag)) {
      if (
        i === 0 ||
        !listTypes.has(getTypeObj(blocksToRender[i - 1]).original_tag)
      ) {
        let replaceCount = 0;
        let startIndex = i;
        const childList = [];
        const listType = typeObj.original_tag;
        while (
          i < blocksToRender.length &&
          listTypes.has(getTypeObj(blocksToRender[i]).original_tag) &&
          getTypeObj(blocksToRender[i]).original_tag === listType
        ) {
          replaceCount += 1;
          if (blocksToRender[i].has_children) {
            wrapObj['has_children'] = true;
          }
          childList.push(getTypeObj(blocksToRender[i]));
          i += 1;
        }

        if (blocksToRender[blocksToRender.length - 1].has_children) {
          wrapObj['has_children'] = true;
        }

        wrapObj = {
          type: typeObj.original_tag,
          isWrapped: true,
          tag: typeObj.original_tag === 'bulleted_list_item' ? 'ul' : 'ol',
          rich_text: childList,
          ...wrapObj,
        };

        blocksToRender.splice(startIndex, replaceCount, wrapObj);
      }
    }
  });

  return blocksToRender;
}
