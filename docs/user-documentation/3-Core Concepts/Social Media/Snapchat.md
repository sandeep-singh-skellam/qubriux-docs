---
sidebar_position: 2
title: Snapchat
---

# Snapchat

Qubriux integrates with Snapchat Ads Manager to let you export your customer segments as Custom Audiences and run targeted ad campaigns on Snapchat. Once your Snapchat account is connected and your advertiser account is configured, you can push any Qubriux segment directly to Snapchat.

## Connecting Your Snapchat Account

1. Navigate to **Social Media > Snapchat**.
2. Click **Connect Snapchat Account**.
3. You will be redirected to Snapchat's OAuth login page. Log in with the Snapchat account linked to your Ads Manager.
4. Approve the requested permissions and return to Qubriux.
5. Qubriux exchanges the authorisation code for an access token and saves it securely.

:::note
You need a Snapchat Business account with Ads Manager access to connect. Personal Snapchat accounts cannot be used.
:::

## Setting Up Your Organisation and Advertiser

After connecting, you need to link your Snapchat Organisation and Advertiser account so Qubriux knows which ad account to use for audience exports.

### Step 1 — Select Your Organisation

1. After connecting, Qubriux fetches the organisations associated with your Snapchat account.
2. Select the **Organisation** that contains your ad account.
3. Click **Confirm**.

### Step 2 — Select Your Advertiser Account

1. Once the organisation is set, your available Advertiser accounts are displayed.
2. Select the **Advertiser Account** you want to use for audience exports.
3. Click **Save**.

:::tip
If you manage multiple brands or clients, each Qubriux merchant account can be linked to a different Snapchat Advertiser account. Set up each merchant separately.
:::

## Exporting a Segment to Snapchat

Once your account is connected and your advertiser is configured, you can export any customer segment to Snapchat as a Custom Audience.

1. Navigate to **Segments** and open the segment you want to export.
2. Click **Export to Social Media** and select **Snapchat**.
3. Choose **Create New Audience** to push the segment as a new Custom Audience in Snapchat Ads Manager.
4. Click **Export**.

Qubriux sends the customer list to Snapchat. Once processed by Snapchat, the audience becomes available for use in your ad campaigns within Ads Manager.

:::note
Snapchat requires a minimum audience size before an audience can be targeted in campaigns. If your segment is too small, the audience will be created but may not be immediately targetable.
:::

## Managing Custom Audiences

You can view all Snapchat Custom Audiences linked to your merchant account from within Qubriux:

1. Navigate to **Social Media > Snapchat > Audiences**.
2. The list shows all audiences previously exported to Snapchat.

You can also view which audiences have been exported from a specific segment:

1. Open a segment from the **Segments** page.
2. Click **View Audiences** to see all Snapchat audiences associated with that segment.

## Disconnecting Snapchat

To remove your Snapchat connection, contact your Qubriux administrator. Removing the connection will stop future audience exports but will not affect existing audiences or active campaigns within Snapchat Ads Manager.
