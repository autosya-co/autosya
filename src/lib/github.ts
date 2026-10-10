import { Octokit } from 'octokit';

const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN;
const OWNER = 'autosya-co';
const REPO = 'toyota';

const octokit = new Octokit({ auth: GITHUB_TOKEN });

export async function getFileContent(path: string) {
  try {
    const { data }: any = await octokit.rest.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: path,
    });

    if (Array.isArray(data)) {
      throw new Error('Path is a directory, not a file.');
    }

    return {
      content: Buffer.from(data.content, 'base64').toString('utf-8'),
      sha: data.sha,
    };
  } catch (error: any) {
    console.error('Error fetching file from GitHub:', error);
    throw error;
  }
}

export async function updateFileContent(path: string, content: string, sha: string, message: string) {
  try {
    const { data } = await octokit.rest.repos.createOrUpdateFileContents({
      owner: OWNER,
      repo: REPO,
      path: path,
      message: message,
      content: Buffer.from(content).toString('base64'),
      sha: sha,
    });
    return data;
  } catch (error: any) {
    console.error('Error updating file on GitHub:', error);
    throw error;
  }
}

export async function listFiles(path: string = '') {
  try {
    const { data }: any = await octokit.rest.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: path,
    });
    return data;
  } catch (error: any) {
    console.error('Error listing files from GitHub:', error);
    throw error;
  }
}
