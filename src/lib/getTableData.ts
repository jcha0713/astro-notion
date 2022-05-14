import { getNotionClient, getDatabaseId } from './notionClient';
import {
  GetDatabaseResponse,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';

// Get metadata of the database eg. title, date
// returns the database object as response
export async function getTableHeader(): Promise<GetDatabaseResponse> {
  try {
    const databaseId = getDatabaseId();
    const notion = getNotionClient();
    const response = await notion.databases.retrieve({
      database_id: databaseId,
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

type tableProps = {
  includeDraft?: boolean;
};

// takes props for filtering options
// returns contents in the database
// by default, it does not include the draft posts
export async function getTableContent(
  props: tableProps = { includeDraft: false }
): Promise<QueryDatabaseResponse> {
  try {
    const { includeDraft } = props;
    const databaseId = getDatabaseId();
    const notion = getNotionClient();

    // this filters out the draft posts by default
    const queryObj = {
      database_id: databaseId,
      ...(!includeDraft && {
        filter: {
          property: 'draft',
          checkbox: {
            does_not_equal: true,
          },
        },
      }),
    };
    const response = await notion.databases.query(queryObj);
    return response;
  } catch (error) {
    console.error(error);
  }
}
