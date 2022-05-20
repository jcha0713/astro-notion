export function getClassAttribute(block, objType) {
  let textObjs = block[block.type][objType];

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

// A helper function that grabs correct HTML element name
// from the type name provided by Notion API
// e.g. paragraph -> p
//
// Later the correctTagName will be used as a prop for polymorphic components
export function getCorrectTagName(block, type: string): string {
  const correctTagName = {
    paragraph: function (block) {
      // const isCode = block[block.type]?.rich_text[0].annotations.code;
      // if (isCode) {
      //   return 'code';
      // }
      return 'p';
    },
    heading_1: function () {
      return 'h1';
    },
    heading_2: function () {
      return 'h2';
    },
    heading_3: function () {
      return 'h3';
    },
    bulleted_list_item: function () {
      return 'li';
    },
    numbered_list_item: function () {
      return 'li';
    },
    quote: function () {
      return 'blockquote';
    },
    code: function () {
      return 'pre';
    },
    callout: function () {
      return 'div';
    },
    image: function () {
      return 'figure';
    },
  };
  return correctTagName[type]();
}
