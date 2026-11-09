/**
 * permissions.js
 * The three built-in roles and what each may do (thesis audit, section 15).
 * Values: 'always' (on, cannot be changed), 'never' (not allowed for the
 * role), 'optional' (off by default; the owner may switch it on per person).
 *
 * Today this drives what the UI shows. The same table must also be enforced
 * by the database (row-level security) once accounts carry real roles.
 */

export const ROLES = [
  { id: 'owner', label: 'Owner', blurb: 'Sees and controls everything, including payroll and ownership.' },
  { id: 'admin', label: 'Admin', blurb: 'Farm manager (encargado). Runs daily operations; cannot pay people, manage admins or delete data.' },
  { id: 'staff', label: 'Staff', blurb: 'Records daily data for assigned batches and sees their own entries and pay.' }
];

const A = 'always';
const N = 'never';
const O = 'optional';

export const PERMISSION_GROUPS = [
  {
    group: 'Daily records',
    items: [
      { id: 'record.daily', label: 'Record feed and deaths on assigned batches', owner: A, admin: A, staff: A },
      { id: 'record.expense', label: 'Record expense receipts', owner: A, admin: A, staff: O },
      { id: 'record.own', label: 'See own entries, who last edited them, and replies', owner: A, admin: A, staff: A },
      { id: 'record.correct', label: 'Request a correction or delete of a saved entry', owner: A, admin: A, staff: A }
    ]
  },
  {
    group: 'Batches',
    items: [
      { id: 'batch.manage', label: 'Create and close batches', owner: A, admin: A, staff: N },
      { id: 'batch.reopen', label: 'Reopen a closed batch, approve backdated entries into it', owner: A, admin: A, staff: N },
      { id: 'batch.cost', label: 'See cost to date and cost per bird', owner: A, admin: A, staff: O }
    ]
  },
  {
    group: 'Sales & buyers',
    items: [
      { id: 'sale.record', label: 'Record sales', owner: A, admin: A, staff: O },
      { id: 'sale.price', label: 'Use price check and see profit per sale', owner: A, admin: A, staff: N },
      { id: 'sale.buyers', label: 'Manage buyers and unpaid balances', owner: A, admin: A, staff: N }
    ]
  },
  {
    group: 'Approvals',
    items: [
      { id: 'approve.requests', label: 'Approve or reject correction requests (never your own)', owner: A, admin: A, staff: N },
      { id: 'approve.concerns', label: 'Answer and resolve concerns', owner: A, admin: A, staff: O }
    ]
  },
  {
    group: 'Reports',
    items: [{ id: 'report.view', label: 'See profit, reports, profit breakdown; export', owner: A, admin: A, staff: N }]
  },
  {
    group: 'Team',
    items: [
      { id: 'team.board', label: 'View task board and activity log', owner: A, admin: A, staff: N },
      { id: 'team.staff', label: 'Invite, deactivate Staff; assign batches and tasks', owner: A, admin: A, staff: N },
      { id: 'team.admins', label: 'Create or deactivate Admins', owner: A, admin: N, staff: N }
    ]
  },
  {
    group: 'Payroll',
    items: [
      { id: 'pay.run', label: 'Set pay rates, record cash advances, run pay, mark paid', owner: A, admin: N, staff: N },
      { id: 'pay.own', label: 'See own payslip', owner: A, admin: A, staff: A }
    ]
  },
  {
    group: 'Farm settings',
    items: [
      { id: 'settings.farm', label: 'Thresholds, recurring costs, to-do rules, notifications', owner: A, admin: A, staff: N },
      { id: 'settings.data', label: 'Backup, restore, data privacy settings', owner: A, admin: N, staff: N },
      { id: 'settings.delete', label: 'Delete a batch or records permanently', owner: A, admin: N, staff: N },
      { id: 'settings.transfer', label: 'Transfer ownership', owner: A, admin: N, staff: N }
    ]
  }
];

const BY_ID = new Map(PERMISSION_GROUPS.flatMap((g) => g.items).map((p) => [p.id, p]));

export function normalizeRole(role) {
  return ROLES.some((r) => r.id === role) ? role : 'owner';
}

/**
 * Whether a role may do something. `granted` lists optional permissions the
 * owner switched on for one person.
 */
export function can(role, permissionId, granted = []) {
  const perm = BY_ID.get(permissionId);
  if (!perm) return false;
  const value = perm[normalizeRole(role)];
  return value === A || (value === O && granted.includes(permissionId));
}

export function roleLabel(role) {
  return ROLES.find((r) => r.id === normalizeRole(role)).label;
}
