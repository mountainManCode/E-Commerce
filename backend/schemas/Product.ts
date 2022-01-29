import { list } from "@keystone-6/core";
import { text, select, integer, relationship } from "@keystone-6/core/fields";
import { isSignedIn, rules } from "../access";

export const Product = list({
  access: {
		operation: {
      create: isSignedIn,
    },
    filter: {
      delete: rules.canManageProducts,
      update: rules.canManageProducts,
      query: rules.canReadProducts
    },
  },
  fields: {
    name: text({ validation: { isRequired: true }}),
    description: text({
      ui: {
        displayMode: 'textarea',
      },
    }),
    photo: relationship({
      ref: 'ProductImage.product',
      ui: {
        displayMode: 'cards',
        cardFields: ['image', 'altText'],
        inlineCreate: { fields: ['image', 'altText'] },
        inlineEdit: { fields: ['image', 'altText'] },
      }
    }),
    status: select({
      options: [
        { label: 'Draft', value: 'DRAfT' },
        { label: 'Available', value: 'AVAILABLE' },
        { label: 'Unavailable', value: 'UNAVAILABLE' },
      ],
      defaultValue: 'DRAFT',
      ui: {
        displayMode: 'segmented-control',
        createView: { fieldMode: 'hidden' },
      },
    }),
    price: integer(),
    user: relationship({
      ref: 'User.products',
      hooks: {
        resolveInput({ operation, resolvedData, context }) {
          // Default to the currently logged in user on create.
          if (operation === 'create' && !resolvedData.user && context.session?.itemId ) {
            return { connect: { id: context.session?.itemId }};
          }
          return resolvedData.user;
        },
      },
    }),
  },
});