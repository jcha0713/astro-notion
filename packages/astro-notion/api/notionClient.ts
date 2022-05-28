import { Client, LogLevel } from '@notionhq/client';

export function getNotionClient(): Client {
  const notion_token = import.meta.env.NOTION_API_KEY;

  // Throw an error if NOTION_API_KEY is not provided
  if (!notion_token) {
    throw new Error(
      `NOTION_API_KEY not found: NOTION_API_KEY must be set in the .env file`
    );
  }

  // initialize new Client object provided by Notion
  // NOTION_API_KEY is required
  const notion = new Client({
    auth: notion_token,
    logLevel: LogLevel.DEBUG, // for debugging
  });

  return notion;
}

export function getDatabaseId(): string {
  let databaseId = import.meta.env.NOTION_DATABASE_ID;

  // Throw an error if NOTION_DATABASE_ID is not provided
  if (!databaseId) {
    throw new Error(
      `NOTION_DATABASE_ID not found: NOTION_DATABASE_ID must be set in the .env file`
    );
  }

  // Throw an error if NOTION_DATABASE_ID is not 32 characters long
  if (databaseId.length !== 32) {
    throw new Error(
      `Invalid length of NOTION_DATABASE_ID: NOTION_DATABASE_ID must be 32 characters long`
    );
  }

  return databaseId;
}
