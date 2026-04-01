---
sidebar_position: 2
title: SMS
---

# SMS

SMS is a high-reach communication channel in Qubriux, ideal for time-sensitive messages such as transaction alerts, promotional offers, and reminder notifications. You can create reusable SMS templates and deploy them across Journeys and Offers.

## SMS Templates

SMS templates define the message content that gets sent to customers. Templates are merchant-specific and can be filtered by channel type, layout type, and message type to keep your library organised.

### Creating an SMS Template

1. Navigate to **Channels > SMS**.
2. Click **Create New Template**.
3. Enter a unique template name.
4. Write your message body. Keep content concise - standard SMS messages are limited to 160 characters per segment.
5. Insert personalisation variables as needed (e.g. customer name, offer code).
6. Click **Save** to store the template.

:::note
Template names must be unique per merchant. Attempting to save a duplicate name will return an error.
:::

### Editing an SMS Template

1. Open the template you want to modify from the SMS templates list.
2. Update the message content or variables.
3. Click **Save** to apply changes.

### Deleting an SMS Template

1. Select the template from the list.
2. Click **Delete**.

:::warning
An SMS template that is currently in use within an active Journey cannot be deleted. Remove it from all active campaigns before deleting.
:::

## Filtering Templates

When your template library grows, you can filter the list by:

- **Channel type** - narrow down to specific SMS sub-types.
- **Layout type** - filter by structural layout category.
- **Message type** - distinguish between promotional, transactional, or other template types.
- **Sort order** - sort alphabetically or by creation date.

## Offer-Specific SMS Templates

When attaching an SMS to an Offer, Qubriux lets you browse templates scoped to the offer context. Templates are grouped by offer type so you can quickly find the most relevant design.

## Using SMS in Journeys

Once an SMS template is created, it can be selected inside a **Send SMS** node in the Journey builder. See [Adding Blocks](../Journeys/5-blocks.md) for details on how to add an SMS node to a journey.
