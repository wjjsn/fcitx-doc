import * as path from 'node:path';
import { defineConfig } from '@rspress/core';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  base:'/fcitx-doc/',
  title: 'Fcitx5 Docs',
  icon: '/linux-icon.png',
  lang: 'zh',
  llms: true,
  logo: {
    light: '/linux-icon.png',
    dark: '/linux-icon.png',
  },
  locales: [
    {
      lang: 'zh',
      label: '中文',
      title: 'Fcitx5 Docs',
      description: 'Fcitx5的文档站',
    },
    {
      lang: 'en',
      label: 'English',
      title: 'Fcitx5 Docs',
      description: 'Docs of Fcitx5',
    },
  ],
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/wjjsn/fcitx-doc',
      },
    ],
    llmsUI: {
      viewOptions: [
        'markdownLink',
        {
          title: '可以通过"URL/llms.txt"一次性把所有页面的内容全部发给AI',
        },
        'chatgpt',
        'claude',
      ],
      placement: 'title',
    },
  },
  
});
