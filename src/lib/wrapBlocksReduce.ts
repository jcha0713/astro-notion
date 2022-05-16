const listTypes = new Set(['bulleted_list_item', 'numbered_list_item']);

const getTypeObj = (block) => {
  return block[block.type];
};

export function wrapBlocksReduce(blocksToRender) {
  for (const block of blocksToRender) {
    console.log(block);
  }
  return blocksToRender;
}
