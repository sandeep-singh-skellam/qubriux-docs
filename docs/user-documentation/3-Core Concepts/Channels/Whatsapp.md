---
sidebar_position: 3
title: WhatsApp
---

# WhatsApp

WhatsApp is a conversational engagement channel in Qubriux that lets you reach customers on the world's most widely used messaging platform. You can create branded message templates, attach rich media, and deploy them across Journeys and Offers.

:::note
WhatsApp messaging in Qubriux is powered by 360dialog. Your merchant account must be onboarded before you can create or send WhatsApp templates.
:::

## Onboarding

Before using WhatsApp, you need to connect your WhatsApp Business account to Qubriux.

1. Navigate to **Channels > WhatsApp**.
2. Click **Connect WhatsApp Account**.
3. Provide your WhatsApp Business details - including your Business ID and API key from 360dialog.
4. Click **Submit** to complete onboarding.

Once submitted, the platform verifies your credentials and links your account. You can check the connection status at any time from the WhatsApp settings page.

:::warning
If onboarding is not completed, you will not be able to create, save, or send WhatsApp templates.
:::

## WhatsApp Templates

WhatsApp templates must be pre-approved by Meta before they can be used to send messages to customers. Qubriux submits your templates to the 360dialog gateway, which forwards them for Meta review.

There are two types of templates:

- **Standard Templates** - pre-built templates provided by Qubriux for common use cases (e.g. order confirmation, loyalty reward notification).
- **Custom Templates** - templates you create from scratch to match your specific campaign or communication needs.

### Creating a Custom Template

1. Navigate to **Channels > WhatsApp > Templates**.
2. Click **Create New Template**.
3. Choose the channel type (e.g. marketing, utility, authentication).
4. Write the message body. You can include personalisation variables using the merge tag picker.
5. Attach media if needed - images, videos, or documents (see [Media Uploads](#media-uploads) below).
6. Click **Submit for Approval**.

The template is sent to Meta for review via 360dialog. Once approved, it becomes available for use in Journeys and Offers.

:::note
Template names and content must follow Meta's WhatsApp messaging policies. Templates that violate these policies will be rejected during the approval process.
:::

### Saving a Template

After a template is approved and ready to use, Qubriux saves both the template definition and its rendered preview:

1. The template content is stored in S3 for rendering.
2. The template record is saved in the platform database, making it selectable in the Journey builder and Offer configuration.

## Media Uploads

WhatsApp templates support rich media content. You can upload the following file types directly within the template builder:

| Media Type | Accepted Formats | Notes |
|------------|-----------------|-------|
| Image | JPG, PNG | Used in image header templates |
| Video | MP4 | Used in video header templates |
| Document | PDF | Used in document header templates |

To upload media:
1. Inside the template builder, click **Upload** next to the media field.
2. Select your file.
3. The file is uploaded to S3 and a URL is attached to the template automatically.

:::warning
Files that fail validation (wrong format, file too large) will be rejected before upload. Ensure your files meet the format requirements before attempting to upload.
:::

## Merge Tags

Merge tags let you personalise WhatsApp messages with customer-specific data. You can insert variables such as customer name, loyalty points, or offer details into the message body.

To use merge tags:
1. Open a template in the editor.
2. Click the **Merge Tags** button to open the variable picker.
3. Select the variable you want to insert - it is placed at the cursor position in the message body.

Qubriux resolves these variables at send time using the customer's profile data.

## Audience Filtering

When setting up a WhatsApp campaign, you can check how many customers in a given segment have a WhatsApp number registered. This helps you estimate reach before sending.

1. Select a customer segment in the campaign setup.
2. The platform displays the count of customers with a valid WhatsApp number in that segment.

## Using WhatsApp in Journeys

Once a template is approved and saved, it can be selected inside a **Send WhatsApp** node in the Journey builder. See [Adding Blocks](../Journeys/5-blocks.md) for details on how to add a WhatsApp node to a journey.
