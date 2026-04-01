---
sidebar_position: 1
title: Email
---

# Email

Email is one of the primary communication channels in Qubriux. You can design branded email layouts, personalise content using dynamic variables, and use these templates across Journeys and Offers to engage customers at the right moment.

## Email Layouts

Email layouts are the building blocks of your email communications. A layout defines the structure, design, and content of an email — including the subject line, header, body, and footer.

Qubriux supports two types of email layouts:

- **Campaign Email Layouts** — used within Journey builder nodes to send emails at specific points in a customer journey.
- **Reward Email Layouts** — pre-configured emails tied to specific reward types (e.g. gift card delivery, cashback notification).

### Creating an Email Layout

1. Navigate to **Channels > Email**.
2. Click **Create New Layout**.
3. Enter a unique layout name. The platform will alert you if the name already exists.
4. Use the drag-and-drop email builder to design your email — add text blocks, images, buttons, and dividers.
5. Insert personalisation variables (merge tags) where needed, such as customer name, points balance, or offer details.
6. Click **Save** to store the layout as a draft.

:::note
Layout names must be unique per merchant. If you try to save a layout with an existing name, the platform will prompt you to choose a different name.
:::

### Editing an Email Layout

1. Open the layout you want to edit from the **Email Layouts** list.
2. Make your changes in the email builder.
3. Click **Save** to update the layout.

:::warning
If another team member is currently editing the same layout, you will see a notification indicating who is editing. Only one user can edit a layout at a time to prevent conflicting changes.
:::

### Deleting an Email Layout

1. Select the layout from the list.
2. Click **Delete**.

:::warning
You cannot delete an email layout that is currently in use within an active Journey or Offer. Remove it from all active campaigns first before deleting.
:::

## Personalisation Variables

Personalisation variables (also called merge tags) allow you to dynamically insert customer-specific data into your email content. Examples include:

- Customer first name
- Loyalty points balance
- Offer name or discount value
- Reward redemption details

Variables are available when editing an email layout. You can select them from the variable picker panel based on the context — general customer data, offer-specific fields, or reward-specific fields.

## Reward Emails

Reward emails are a special category of email templates used to communicate reward events to customers — such as when a gift card is issued or a cashback reward is granted.

These templates are pre-built per reward type and can be customised to match your brand. To update a reward email:

1. Navigate to **Channels > Email > Reward Emails**.
2. Select the reward type whose email you want to update.
3. Edit the content in the email builder.
4. Click **Save**.

## Using Email in Journeys

Once an email layout is created, it can be selected inside a **Send Email** node in the Journey builder. See [Adding Blocks](../Journeys/5-blocks.md) for details on how to add an email node to a journey.
