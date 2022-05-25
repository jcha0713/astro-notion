import * as fs from 'fs';
import * as https from 'https';

export function getClassAttribute(block, objType) {
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
    callout: 'p',
    image: 'figure',
    video: 'figure',
    divider: 'hr',
    to_do: 'li',
    toggle: 'summary',
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

