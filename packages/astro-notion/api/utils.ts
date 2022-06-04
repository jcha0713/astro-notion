import * as fs from 'fs';
import * as https from 'https';

const supportedBlockTypes = new Set([
  'paragraph',
  'heading_1',
  'heading_2',
  'heading_3',
  'callout',
  'quote',
  'bulleted_list_item',
  'numbered_list_item',
  'to_do',
  'toggle',
  'code',
  'image',
  'video',
  'divider',
  'bookmark',
]);

export function isSupportedBlockType(type) {
  return supportedBlockTypes.has(type);
}

export function getClassAttributes(blockObj, type = '') {
  let classes = type ? [`notion-${type}`] : [];
  if (blockObj?.classList?.length > 0) {
    classes = [...classes, ...blockObj?.classList];
  }
  return classes.length > 0 ? `class='${classes.join(' ')}'` : '';
}

export function setClassAttributes(block, objType) {
  let textObjs = block[block.type][objType];

  function getClassArray(textObj) {
    let attrs = [];
    const annotations = textObj?.annotations;
    if (!annotations) {
      return attrs;
    }
    for (const style in annotations) {
      if (annotations[style]) {
        style !== 'color' && attrs.push(`notion-${style}`);
      }
    }
    return attrs;
  }

  if (textObjs.length > 0) {
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
    paragraph: 'p',
    heading_1: 'h1',
    heading_2: 'h2',
    heading_3: 'h3',
    bulleted_list_item: 'li',
    numbered_list_item: 'li',
    quote: 'blockquote',
    code: 'pre',
    image: 'figure',
    video: 'figure',
    divider: 'hr',
    to_do: 'li',
    callout: 'p',
    toggle: 'p',
    bookmark: 'p',
  };
  return correctTagName[type];
}

export async function downloadFile(url, targetDir, targetFile) {
  const targetPath = targetDir + targetFile;
  if (!fs.existsSync(targetPath)) {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    return await new Promise((resolve, reject) => {
      https
        .get(url, (response) => {
          const code = response.statusCode ?? 0;

          if (code >= 400) {
            return reject(new Error(response.statusMessage));
          }

          // handle redirects
          if (code > 300 && code < 400 && !!response.headers.location) {
            return downloadFile(
              response.headers.location,
              targetDir,
              targetFile
            );
          }

          // save the file to disk
          const fileWriter = fs
            .createWriteStream(targetPath)
            .on('finish', () => {
              resolve({});
            });

          response.pipe(fileWriter);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }
  return null;
}

export function getEmoji(block) {}

export function getPlainText(textObj) {
  if (typeof textObj?.type !== 'string') {
    return;
  }

  const type = textObj.type;
  const plainText = textObj[type].map((text) => text.plain_text).join('');

  return plainText;
}

export function getPostDate(created, edited, userDateObj) {
  const isValidUserDate = (userDateObj) => {
    if (
      userDateObj === null ||
      userDateObj?.type !== 'date' ||
      userDateObj[userDateObj?.type] === null
    ) {
      return false;
    }

    const dateStr = userDateObj[userDateObj.type].start;
    const regex = /^\d{4}-\d{2}-\d{2}$/;

    if (dateStr.match(regex) === null) {
      return false;
    }

    const date = new Date(dateStr);
    const timestamp = date.getTime();

    if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
      return false;
    }

    return date.toISOString().startsWith(dateStr);
  };

  const getUserDate = (userDateObj) => {
    if (
      userDateObj === null ||
      userDateObj?.type !== 'date' ||
      userDateObj[userDateObj?.type] === null
    ) {
      return false;
    }

    return userDateObj[userDateObj.type].start;
  };

  const formatDate = (dateStr) => {
    return dateStr.slice(0, 10);
  };

  const postCreated = isValidUserDate(userDateObj)
    ? getUserDate(userDateObj)
    : created;

  return {
    created: formatDate(postCreated),
    edited: formatDate(edited),
  };
}
