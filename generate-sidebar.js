const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const IGNORE_FILES = ['_sidebar.md', '_navbar.md', 'README.md', 'CLAUDE.md'];

const getTitle = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : path.basename(filePath, '.md');
};

const shouldIgnore = (entry) =>
  entry.name.startsWith('.') || entry.name === 'node_modules';

const buildTree = (dir, basePath = '') => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const validEntries = entries.filter((entry) => !shouldIgnore(entry));

  const folders = validEntries
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.join(basePath, entry.name);
      const subtree = buildTree(fullPath, relativePath);
      return { name: entry.name, path: relativePath, ...subtree };
    })
    .filter((folder) => folder.folders.length > 0 || folder.files.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name));

  const files = validEntries
    .filter((entry) => !entry.isDirectory())
    .filter((entry) => entry.name.endsWith('.md') && !IGNORE_FILES.includes(entry.name))
    .map((entry) => ({
      name: entry.name,
      path: path.join(basePath, entry.name),
      fullPath: path.join(dir, entry.name),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return { folders, files };
};

const generateLines = (tree, indent = 0) => {
  const prefix = '  '.repeat(indent);

  const fileLines = tree.files.map((file) => {
    const title = getTitle(file.fullPath);
    return `${prefix}* [${title}](/${file.path})`;
  });

  const folderLines = tree.folders.flatMap((folder) => [
    '',
    `${prefix}* **${folder.name}**`,
    ...generateLines(folder, indent + 1),
  ]);

  return [...fileLines, ...folderLines];
};

const generateSidebar = () => {
  const tree = buildTree(ROOT_DIR);
  const lines = [
    '* **ドキュメント**',
    '',
    '* [ホーム](/)',
    ...generateLines(tree),
  ];

  const content = lines.join('\n') + '\n';
  fs.writeFileSync(path.join(ROOT_DIR, '_sidebar.md'), content);

  console.log('_sidebar.md を生成しました:');
  console.log(content);
};

generateSidebar();
