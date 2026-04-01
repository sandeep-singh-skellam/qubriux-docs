---
sidebar_position: 1
title: Meta
---

# Meta

Qubriux integrates with Meta (Facebook and Instagram) to let you export customer audiences, publish posts, and track social media performance - all from within the platform. Once your Meta account is connected, you can run targeted ad campaigns using your Qubriux customer segments.

## Connecting Your Meta Account

Before you can export audiences or publish posts, you need to connect your Meta account to Qubriux.

1. Navigate to **Social Media > Meta**.
2. Click **Connect Meta Account**.
3. You will be redirected to Meta's login page. Log in with the Facebook account that manages your business pages and ad accounts.
4. Grant the requested permissions and return to Qubriux.
5. Qubriux retrieves a long-lived access token and stores it securely.

Once connected, your linked Facebook Pages and Ad Accounts will appear in the Meta settings panel.

:::note
You must have admin access to the Facebook Page and/or Ad Account you want to connect. Pages or accounts you don't administer will not appear in the selection list.
:::

### Selecting a Page or Ad Account

After connecting, you need to select which Facebook Page and Ad Account Qubriux should use:

1. From the connected account list, choose the **Facebook Page** you want to link.
2. Choose the **Ad Account** to use for audience exports and campaigns.
3. Click **Save**.

### Refreshing Tokens

Meta access tokens expire periodically. If your Meta connection stops working, refresh your tokens:

1. Navigate to **Social Media > Meta > Connected Accounts**.
2. Click **Refresh Connection** next to the affected account.

## Publishing Posts

You can create and publish social media posts directly from Qubriux to your connected Facebook Page.

### Creating a Post

1. Navigate to **Social Media > Meta > Posts**.
2. Click **Create Post**.
3. Write your post content.
4. Optionally upload images or videos (see [Media Uploads](#media-uploads) below).
5. Select the target Facebook Page.
6. Click **Publish** to post immediately, or schedule it for a later time.

### Managing Posts

From the Posts list you can:
- View all posts filtered by **status** (published, scheduled, draft) or **channel**.
- Click any post to see full details and performance metrics.
- Edit a draft post before it goes live.

## Media Uploads

You can attach images and videos to posts or ad creatives directly within Qubriux.

| Media Type | Notes |
|------------|-------|
| Images | Multiple files can be uploaded at once |
| Video | Upload one video file at a time |

To upload media:
1. Inside the post editor, click **Upload Media**.
2. Select your image or video file(s).
3. Files are stored securely and attached to the post automatically.

:::warning
Files that fail format or size validation will be rejected before upload. Ensure your media meets Meta's ad creative specifications.
:::

## Analytics

### Account Overview

Get a quick snapshot of your connected Meta page performance:

1. Navigate to **Social Media > Meta > Analytics**.
2. The **Overview** tab shows key metrics for your linked Facebook Page - reach, impressions, and engagement.

### Detailed Analytics

For a deeper date-range analysis:

1. Click **Detailed Report** in the Analytics section.
2. Set your desired date range and metrics.
3. The report breaks down performance across the selected period.

### Post Analytics

View performance data for individual posts:

1. From the **Posts** list, click on any published post.
2. The **Analytics** tab shows reach, impressions, reactions, comments, and shares for that post.

## Audience Export

Export your Qubriux customer segments to Meta as Custom Audiences for use in ad campaigns. See [How to Set Up the Ads Account](./How%20to%20setup%20the%20ads%20account.md) for the full setup guide.

## Disconnecting Meta

To remove a connected Meta account:

1. Navigate to **Social Media > Meta > Connected Accounts**.
2. Find the account or page you want to remove.
3. Click **Disconnect**.

:::warning
Disconnecting a Meta account will stop any active audience syncs associated with that connection. Active ad campaigns using those audiences are not affected - they continue running within Meta's platform - but Qubriux will no longer be able to update or refresh those audiences.
:::
