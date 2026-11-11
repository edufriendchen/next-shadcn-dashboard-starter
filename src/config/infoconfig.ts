import type { InfobarContent } from '@/components/ui/infobar';

export const workspacesInfoContent: InfobarContent = {
  title: 'Workspaces Management',
  sections: [
    {
      title: 'Overview',
      description:
        'The Workspaces page allows you to manage your workspaces and switch between them. Workspaces are backed by the AuthBoot organization API — you can view all available workspaces, create new ones, and switch your active workspace.',
      links: []
    },
    {
      title: 'Creating Workspaces',
      description:
        'To create a new workspace, click the "Create Organization" button. You will be prompted to enter a workspace name and code. Once created, you can switch to the new workspace and start managing it.',
      links: []
    },
    {
      title: 'Switching Workspaces',
      description:
        'You can switch between workspaces by clicking on a workspace in the list. Switching calls the AuthBoot switch-organization API, which re-scopes your access token to the chosen workspace.',
      links: []
    },
    {
      title: 'Workspace Features',
      description:
        'Each workspace operates independently with its own team members, roles, permissions, and billing. This allows you to manage multiple projects or teams within a single account while keeping their data and settings separate.',
      links: []
    },
    {
      title: 'Server-Side Permission Checks',
      description:
        'The AuthBoot backend enforces membership and RBAC on every admin API call. Server-side permission checks ensure that users can only access resources for their active organization.',
      links: []
    }
  ]
};

export const teamInfoContent: InfobarContent = {
  title: 'Team Management',
  sections: [
    {
      title: 'Overview',
      description:
        'The Team Management page allows you to manage your workspace team, including members, roles, security settings, and more. Team management will be backed by the AuthBoot membership and invitation APIs.',
      links: []
    },
    {
      title: 'Managing Team Members',
      description:
        'You can add, remove, and manage team members from this page. Invite new members by email, assign roles, and control their access levels. Each member can have different permissions based on their role.',
      links: []
    },
    {
      title: 'Roles and Permissions',
      description:
        'Roles and permissions are defined and enforced by the AuthBoot RBAC backend. Roles define what actions team members can perform within the workspace. Common roles include admin, member, and custom roles.',
      links: []
    },
    {
      title: 'Security Settings',
      description:
        "Manage security settings for your workspace, including authentication requirements, session management, and access controls. These settings help protect your organization's data and resources.",
      links: []
    },
    {
      title: 'Organization Settings',
      description:
        'Configure general organization settings such as name, logo, and other workspace preferences. These settings apply to the entire workspace and affect all team members.',
      links: []
    },
    {
      title: 'Navigation RBAC System',
      description:
        'The application includes a fully client-side navigation filtering system using the `useNav` hook. It supports `requireOrg`, `permission`, and `role` checks for instant access control. Navigation items are configured in `src/config/nav-config.ts` with `access` properties.',
      links: []
    }
  ]
};

export const workspaceSettingsInfoContent: InfobarContent = {
  title: 'Workspace Settings',
  sections: [
    {
      title: 'Overview',
      description:
        'The Workspace Settings page configures the active workspace — its general info (name, code, logo), the sign-in methods available to its members, and ownership actions.',
      links: []
    },
    {
      title: 'General Settings',
      description:
        'Edit the workspace name, code, and logo. The logo can be uploaded directly and is stored by the AuthBoot backend; name and code update the organization record.',
      links: []
    },
    {
      title: 'Login Methods',
      description:
        'Choose which sign-in methods members can use: built-in email/phone, or third-party OAuth providers (WeChat, Alipay, Google, GitHub, Apple). Provider credentials are stored per workspace through the OAuth config API.',
      links: []
    },
    {
      title: 'Danger Zone',
      description:
        'Leave the workspace (losing access until invited back) or delete it permanently. Deleting removes all members, roles, login configurations, and data. Role and membership checks are enforced server-side by the backend.',
      links: []
    },
    {
      title: 'Active Workspace',
      description:
        'Settings always apply to the workspace selected in the header switcher. The page falls back to a hint card when no workspace is active.',
      links: []
    }
  ]
};

export const billingInfoContent: InfobarContent = {
  title: 'Billing & Plans',
  sections: [
    {
      title: 'Overview',
      description:
        "The Billing page allows you to manage your organization's subscription and usage limits. Plans and subscriptions are not yet wired up — they will be served by the AuthBoot billing API once it ships.",
      links: []
    },
    {
      title: 'Available Plans',
      description:
        'View and subscribe to available plans through the pricing table. Plans are created and managed in the AuthBoot backend. This page will list the plans exposed by the billing API.',
      links: []
    },
    {
      title: 'Plan Features',
      description:
        'Each plan can include specific features that unlock functionality in the application. Features are assigned to plans in the backend and can be checked on the client for navigation visibility (UX only — the backend enforces access on every API call).',
      links: []
    },
    {
      title: 'Access Control',
      description:
        'Plans and features are used for access control throughout the application. Server-side checks are enforced by the AuthBoot backend. Client-side protection uses conditional rendering based on the signed-in organization.',
      links: []
    },
    {
      title: 'Billing Cost Structure',
      description:
        'Billing infrastructure is self-hosted: payments, plans, and usage limits are entirely under your control once the billing API is implemented.',
      links: []
    },
    {
      title: 'Setup Requirements',
      description:
        'No external billing provider is required. The AuthBoot backend owns plans and subscriptions; no third-party dashboard configuration is needed.',
      links: []
    },
    {
      title: 'Status',
      description:
        'Billing is not implemented yet — the page renders a placeholder until the backend billing endpoints are available.',
      links: []
    }
  ]
};

export const productInfoContent: InfobarContent = {
  title: 'Product Management',
  sections: [
    {
      title: 'Overview',
      description:
        'The Products page allows you to manage your product catalog. You can view all products in a table format with server-side functionality including sorting, filtering, pagination, and search capabilities. Use the "Add New" button to create new products.',
      links: [
        {
          title: 'Product Management Guide',
          url: '#'
        }
      ]
    },
    {
      title: 'Adding Products',
      description:
        'To add a new product, click the "Add New" button in the page header. You will be taken to a form where you can enter product details including name, description, price, category, and upload product images.',
      links: [
        {
          title: 'Adding Products Documentation',
          url: '#'
        }
      ]
    },
    {
      title: 'Editing Products',
      description:
        'You can edit existing products by clicking on a product row in the table. This will open the product edit form where you can modify any product information. Changes are saved automatically when you submit the form.',
      links: [
        {
          title: 'Editing Products Guide',
          url: '#'
        }
      ]
    },
    {
      title: 'Deleting Products',
      description:
        'Products can be deleted from the product listing table. Click the delete action for the product you want to remove. You will be asked to confirm the deletion before the product is permanently removed from your catalog.',
      links: [
        {
          title: 'Product Deletion Policy',
          url: '#'
        }
      ]
    },
    {
      title: 'Table Features',
      description:
        'The product table includes several powerful features to help you manage large product catalogs efficiently. You can sort columns by clicking on column headers, filter products using the filter controls, navigate through pages using pagination, and quickly find products using the search functionality.',
      links: [
        {
          title: 'Table Features Documentation',
          url: '#'
        },
        {
          title: 'Sorting and Filtering Guide',
          url: '#'
        }
      ]
    },
    {
      title: 'Product Fields',
      description:
        'Each product can have the following fields: Name (required), Description (optional text), Price (numeric value), Category (for organizing products), and Image Upload (for product photos). All fields can be edited when creating or updating a product.',
      links: [
        {
          title: 'Product Fields Specification',
          url: '#'
        }
      ]
    }
  ]
};
