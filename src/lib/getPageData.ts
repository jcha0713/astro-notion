import { getNotionClient } from './notionClient';
import { getTableContent } from './getTableData';

export async function getPageData(pageId: string) {
  const notion = getNotionClient();
  const response = await notion.pages.retrieve({ page_id: pageId });

  return response;
}
