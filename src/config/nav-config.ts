import { NavGroup } from '@/types';

/**
 * Navigation configuration with RBAC support
 *
 * This configuration is used for both the sidebar navigation and Cmd+K bar.
 * Items are organized into groups, each rendered with a SidebarGroupLabel.
 *
 * RBAC Access Control:
 * Each navigation item can have an `access` property that controls visibility
 * based on permissions, plans, features, roles, and organization context.
 *
 * Examples:
 *
 * 1. Require organization:
 *    access: { requireOrg: true }
 *
 * 2. Require specific permission:
 *    access: { requireOrg: true, permission: 'org:teams:manage' }
 *
 * 3. Require specific plan:
 *    access: { plan: 'pro' }
 *
 * 4. Require specific feature:
 *    access: { feature: 'premium_access' }
 *
 * 5. Require specific role:
 *    access: { role: 'admin' }
 *
 * 6. Multiple conditions (all must be true):
 *    access: { requireOrg: true, permission: 'org:teams:manage', plan: 'pro' }
 *
 * Note: The `visible` function is deprecated but still supported for backward compatibility.
 * Use the `access` property for new items.
 */
export const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    labelKey: 'overview',
    items: [
      {
        title: 'Dashboard',
        titleKey: 'dashboard',
        url: '/dashboard/overview',
        icon: 'dashboard',
        isActive: false,
        shortcut: ['d', 'd'],
        items: []
      },
      {
        title: 'Workspaces',
        titleKey: 'workspaces',
        url: '/dashboard/workspaces',
        icon: 'workspace',
        isActive: false,
        items: []
      },
      {
        title: 'Teams',
        titleKey: 'teams',
        url: '/dashboard/workspaces/team',
        icon: 'teams',
        isActive: false,
        items: [],
        access: { requireOrg: true }
      },
      {
        title: 'Product',
        titleKey: 'product',
        url: '/dashboard/product',
        icon: 'product',
        shortcut: ['p', 'p'],
        isActive: false,
        items: []
      },
      {
        title: 'Users',
        titleKey: 'users',
        url: '/dashboard/users',
        icon: 'teams',
        shortcut: ['u', 'u'],
        isActive: false,
        items: []
      },
      {
        title: 'Organizations',
        titleKey: 'organizations',
        url: '/dashboard/organizations',
        icon: 'workspace',
        shortcut: ['o', 'o'],
        isActive: false,
        items: []
      },
      {
        title: 'Kanban',
        titleKey: 'kanban',
        url: '/dashboard/kanban',
        icon: 'kanban',
        shortcut: ['k', 'k'],
        isActive: false,
        items: []
      },
      {
        title: 'Chat',
        titleKey: 'chat',
        url: '/dashboard/chat',
        icon: 'chat',
        shortcut: ['c', 'c'],
        isActive: false,
        items: []
      },
      {
        title: 'AI Chat',
        titleKey: 'aiChat',
        url: '/dashboard/ai-chat',
        icon: 'sparkles',
        shortcut: ['a', 'i'],
        isActive: false,
        items: []
      }
    ]
  },
  {
    label: 'Elements',
    labelKey: 'elements',
    items: [
      {
        title: 'Forms',
        titleKey: 'forms',
        url: '#',
        icon: 'forms',
        isActive: true,
        items: [
          {
            title: 'Basic Form',
            titleKey: 'basicForm',
            url: '/dashboard/forms/basic',
            icon: 'forms',
            shortcut: ['f', 'f']
          },
          {
            title: 'Multi-Step Form',
            titleKey: 'multiStepForm',
            url: '/dashboard/forms/multi-step',
            icon: 'forms'
          },
          {
            title: 'Sheet & Dialog',
            titleKey: 'sheetForm',
            url: '/dashboard/forms/sheet-form',
            icon: 'forms'
          },
          {
            title: 'Advanced Patterns',
            titleKey: 'advancedForm',
            url: '/dashboard/forms/advanced',
            icon: 'forms'
          }
        ]
      },
      {
        title: 'React Query',
        titleKey: 'reactQuery',
        url: '/dashboard/react-query',
        icon: 'code',
        isActive: false,
        items: []
      },
      {
        title: 'Icons',
        titleKey: 'icons',
        url: '/dashboard/elements/icons',
        icon: 'palette',
        isActive: false,
        items: []
      }
    ]
  },
  {
    label: '',
    items: [
      {
        title: 'Pro',
        titleKey: 'pro',
        url: '#',
        icon: 'pro',
        isActive: false,
        items: [
          {
            title: 'Exclusive',
            titleKey: 'exclusive',
            url: '/dashboard/exclusive',
            icon: 'exclusive',
            shortcut: ['e', 'e']
          }
        ]
      },
      {
        title: 'Account',
        titleKey: 'account',
        url: '#',
        icon: 'account',
        isActive: true,
        items: [
          {
            title: 'Profile',
            titleKey: 'profile',
            url: '/dashboard/profile',
            icon: 'profile',
            shortcut: ['m', 'm']
          },
          {
            title: 'Notifications',
            titleKey: 'notifications',
            url: '/dashboard/notifications',
            icon: 'notification',
            shortcut: ['n', 'n']
          },
          {
            title: 'Billing',
            titleKey: 'billing',
            url: '/dashboard/billing',
            icon: 'billing',
            shortcut: ['b', 'b'],
            access: { requireOrg: true }
          },
          {
            title: 'Login',
            titleKey: 'login',
            shortcut: ['l', 'l'],
            url: '/',
            icon: 'login'
          }
        ]
      }
    ]
  }
];
