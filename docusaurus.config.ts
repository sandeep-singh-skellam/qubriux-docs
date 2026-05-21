import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Qubriux Documentation',
  tagline: '',
  favicon: 'https://qbshopper-public.s3.ap-south-1.amazonaws.com/ui/assets/icons/Q_Qubriux.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'sandeep-singh-skellam', // Usually your GitHub org/user name.
  projectName: 'qubriux-docs', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: '',
      logo: {
        alt: 'Qubriux Logo',
        src: 'https://qbshopper-public.s3.ap-south-1.amazonaws.com/ui/assets/icons/QubLogo.svg',
      },
      items: [
         // User Documentation Dropdown
          {
            type: 'docSidebar',
            sidebarId: 'userSidebar', // This must match the key in sidebars.js
            position: 'left',
            label: 'User Documentation',
          },
          // API Documentation Dropdown
          {
            type: 'docSidebar',
            sidebarId: 'apiSidebar', // This must match the key in sidebars.js
            position: 'left',
            label: 'API Documentation',
          },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'User Documentation',
          items: [
            {
              label: 'Introduction',
              to: '/docs/intro',
            },
            {
              label: 'Core Concepts',
              to: '/docs/user-documentation/category/core-concepts',
            },
          ],
        },
        {
          title: 'API Documentation',
          items: [
            {
              label: 'Loyalty & Rewards API',
              to: '/docs/api-documentation/loyalty/loyalty-rewards-api',
            },
            {
              label: 'Wallet API',
              to: '/docs/api-documentation/loyalty/wallet-api',
            },
            {
              label: 'Badges API',
              to: '/docs/api-documentation/loyalty/badges-api',
            },
            {
              label: 'Gamification API',
              to: '/docs/api-documentation/loyalty/gamification-api',
            },
          ],
        },
        {
          title: 'Company',
          items: [
            {
              label: 'Qubriux',
              href: 'https://qubriux.com',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Qubriux. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};


export default config;