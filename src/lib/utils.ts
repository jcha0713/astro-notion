export function getClassAttribute(block) {
  let textObjs = block[block.type].rich_text;

  function getClassArray(textObj) {
    let attrs = [];
    const annotations = textObj.annotations;
    if (!annotations) {
      return;
    }
    for (const style in annotations) {
      if (annotations[style]) {
        style !== 'color' && attrs.push(`notion-${style}`);
      }
    }
    return attrs;
  }

  if (textObjs.length > 1) {
    textObjs = textObjs.map((textObj) => {
      return {
        ...textObj,
        classList: getClassArray(textObj),
      };
    });
  } else {
    textObjs[0]['classList'] = getClassArray(textObjs[0]);
  }

  return textObjs;
}
