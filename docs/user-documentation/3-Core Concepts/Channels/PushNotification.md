---
sidebar_position: 4
title: Push Notifications
---

# Push Notifications

Push notifications allow you to send real-time alerts directly to a customer's mobile device or browser through the Qubriux platform. They are effective for time-sensitive communications such as flash sale announcements, loyalty milestone achievements, and personalised re-engagement prompts.

## Push Notification Templates

Push notification templates define the title, message body, and any additional payload sent to the customer's device. Templates are organised by type so you can quickly browse and select the right one when building a campaign or journey.

### Creating a Push Notification Template

1. Navigate to **Channels > Push Notifications**.
2. Click **Create New Template**.
3. Enter a unique template name.
4. Fill in the notification **Title** and **Message Body**.
5. Add personalisation variables as needed (e.g. customer name, points balance).
6. Click **Save** to store the template.

:::note
Template names must be unique per merchant.
:::

### Editing a Push Notification Template

1. Open the template you want to modify.
2. Update the title, body, or variables.
3. Click **Save** to apply changes.

### Deleting a Push Notification Template

1. Select the template from the list.
2. Click **Delete**.

:::warning
A push notification template that is currently in use within an active Journey cannot be deleted. Remove it from all active campaigns before deleting.
:::

## Filtering Templates

You can filter your push notification template library by **type** to narrow down the list - for example, to show only promotional or transactional notification templates.

## Using Push Notifications in Journeys

Once a push notification template is created, it can be selected inside a **Send Push Notification** node in the Journey builder. See [Adding Blocks](../Journeys/5-blocks.md) for details on how to add a push notification node to a journey.
