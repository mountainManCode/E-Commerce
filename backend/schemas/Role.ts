import { relationship, text } from "@keystone-6/core/fields";
import { list } from "@keystone-6/core";
import { permissions } from "../access";
import { permissionFields } from "./fields";

export const Role = list({
	access: {
		operation: {
			create: permissions.canManageRoles,
			query: () => true,
			update: permissions.canManageRoles,
			delete: permissions.canManageRoles
		},
	},
	fields: {
		name: text({ validation: { isRequired: true }}),
		assignedTo: relationship({
			ref: 'User.role',
			many: true,
			ui: {
				itemView: { fieldMode: 'read' }
			}
		}),
		...permissionFields
	},
	ui: {
		hideCreate: args => !permissions.canManageRoles(args),
		hideDelete: args => !permissions.canManageRoles(args),
		isHidden: args => !permissions.canManageRoles(args),
	}
})