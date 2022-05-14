import { getNotionClient } from './notionClient';
import { getTableContent } from './getTableData';

// uses notion client object,
// it gets page information using pageId
export async function getPageData(pageId: string) {
  const notion = getNotionClient();
  const response = await notion.pages.retrieve({ page_id: pageId });

  return response;
}
