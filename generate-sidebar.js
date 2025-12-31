const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const IGNORE_FILES = ['_sidebar.md', '_navbar.md', 'README.md'];

function getTitle(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const match = content.match(/^#\s+(.+)$/m);
  if (match) {
    return match[1].trim();
  }
  return path.basename(filePath, '.md');
}

function buildTree(dir, basePath = '') {
  const tree = {
    folders: [],
    files: [],
  };
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(basePath, entry.name);

    if (entry.name.startsWith('.') || entry.name === 'node_modules') {
      continue;
    }

    if (entry.isDirectory()) {
      const subtree = buildTree(fullPath, relativePath);
      if (subtree.folders.length > 0 || subtree.files.length > 0) {
        tree.folders.push({
          name: entry.name,
          path: relativePath,
          ...subtree,
        });
      }
    } else if (entry.name.endsWith('.md') && !IGNORE_FILES.includes(entry.name)) {
      tree.files.push({
        name: entry.name,
        path: relativePath,
        fullPath: fullPath,
      });
    }
  }

  tree.folders.sort((a, b) => a.name.localeCompare(b.name));
  tree.files.sort((a, b) => a.name.localeCompare(b.name));

  return tree;
}

function generateLines(tree, indent = 0) {
  const lines = [];
  const prefix = '  '.repeat(indent);

  for (const file of tree.files) {
    const title = getTitle(file.fullPath);
    lines.push(`${prefix}* [${title}](/${file.path})`);
  }

  for (const folder of tree.folders) {
    lines.push('');
    lines.push(`${prefix}* **${folder.name}**`);
    lines.push(...generateLines(folder, indent + 1));
  }

  return lines;
}

function generateSidebar() {
  const tree = buildTree(ROOT_DIR);

  const lines = [
    '* **ドキュメント**',
    '',
    '* [ホーム](/)',
  ];

  lines.push(...generateLines(tree));

  const content = lines.join('\n') + '\n';
  fs.writeFileSync(path.join(ROOT_DIR, '_sidebar.md'), content);

  console.log('_sidebar.md を生成しました:');
  console.log(content);
}

generateSidebar();
