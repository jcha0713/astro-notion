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

export function getClassAttributes(blockObj) {
  let classes = [];
  let filtered = Object.keys(blockObj.annotations)
    .filter((key) => blockObj.annotations[key] && key !== 'color')
    .map((attr) => `notion-${attr}`);
  classes = [...filtered];
  if (blockObj.href) {
    classes.push('notion-link');
  }
  console.log(classes);
  return classes.length > 0 ? `class='${classes.join(' ')}'` : '';
}

export function getStyles(blockObj) {
  const color = getColor(blockObj.annotations?.color);
  return getStyleString(color);
}

export function getStyleString(styleObj) {
  if (!styleObj) {
    return [];
  }
  return Object.keys(styleObj).map((key) => `${key}: ${styleObj[key]}`);
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

export function getColor(color) {
  if (typeof color !== 'string') {
    return '';
  }

  const correctColor = {
    gray: '#787774',
    brown: '#9f6b53',
    orange: '#d9730d',
    yellow: '#cb912f',
    green: '#448361',
    blue: '#337ea9',
    purple: '#9065b0',
    pink: '#c14c8a',
    red: '#d44c47',
    gray_background: '#f1f1ef',
    brown_background: '#f4eeee',
    orange_background: '#fbecdd',
    yellow_background: '#fbf3db',
    green_background: '#edf3ec',
    blue_background: '#e7f3f8',
    purple_background: 'rgba(244, 240, 247, 0.8)',
    pink_background: 'rgba(249, 238, 243, 0.8)',
    red_background: '#fdebec',
  };

  if (color === 'default') {
    return '';
  }
  if (color.endsWith('background')) {
    return { 'background-color': correctColor[color] };
  }
  return { color: correctColor[color] };
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
