---
sidebar_position: 4
title: How to Set Up the Ads Account
---

# How to Set Up the Ads Account

This guide walks you through connecting your social media ad accounts to Qubriux so you can export customer segments as Custom Audiences and run targeted campaigns on Meta, Snapchat, and TikTok.

## Overview

Qubriux supports audience export to three platforms:

| Platform | What You Need |
|----------|--------------|
| Meta (Facebook / Instagram) | Facebook Business account with an Ad Account and Page |
| Snapchat | Snapchat Business account with Ads Manager access |
| TikTok | TikTok for Business account with Ads Manager access |

Each platform follows the same general pattern: **connect via OAuth → select your ad account → export segments**.

---

## Setting Up Meta Ads Account

### Prerequisites
- A Facebook account with admin access to a Facebook Page.
- A Meta Ads Manager account with at least one active Ad Account.

### Steps

1. Navigate to **Social Media > Meta**.
2. Click **Connect Meta Account**.
3. Log in to Facebook when redirected and grant the requested permissions.
4. Return to Qubriux — your connected Pages and Ad Accounts will be listed.
5. Select the **Facebook Page** you want to associate.
6. Select the **Ad Account** to use for audience exports.
7. Click **Save**.

Your Meta ads account is now ready. You can export segments from the **Segments** page by clicking **Export to Social Media > Meta**.

:::tip
If you connect multiple Facebook users, each with their own pages and ad accounts, all available pages and accounts are shown in the selection list. Pick the ones relevant to your brand.
:::

---

## Setting Up Snapchat Ads Account

### Prerequisites
- A Snapchat Business account.
- An active Snapchat Ads Manager account with at least one Organisation and Advertiser.

### Steps

1. Navigate to **Social Media > Snapchat**.
2. Click **Connect Snapchat Account**.
3. Log in to Snapchat when redirected and approve the permissions.
4. Return to Qubriux. Your Snapchat Organisations will be listed.
5. Select your **Organisation**.
6. Select the **Advertiser Account** to use.
7. Click **Save**.

Your Snapchat ads account is now ready. You can export segments from the **Segments** page by clicking **Export to Social Media > Snapchat**.

---

## Setting Up TikTok Ads Account

### Prerequisites
- A TikTok for Business account.
- An active TikTok Ads Manager account with at least one Advertiser.

### Steps

1. Navigate to **Social Media > TikTok**.
2. Click **Connect TikTok Account**.
3. Log in to TikTok when redirected and approve the permissions.
4. Return to Qubriux. Your linked Advertiser accounts will be listed.
5. Select the **Advertiser Account** to use for audience exports.
6. Click **Save**.

Your TikTok ads account is now ready. You can export segments from the **Segments** page by clicking **Export to Social Media > TikTok**.

---

## Exporting a Segment as a Custom Audience

Once at least one ads account is connected, you can export any segment:

1. Navigate to **Segments** and open the segment you want to export.
2. Click **Export to Social Media**.
3. Select the target platform — **Meta**, **Snapchat**, or **TikTok**.
4. Choose **Create New Audience** and confirm.

The segment is pushed to the selected platform. Processing time varies — typically a few minutes to a few hours depending on segment size and platform.

:::note
Custom Audiences on all three platforms require a minimum number of matched customers before they can be used for ad targeting. Very small segments may be created but won't be immediately targetable until they reach the platform's minimum threshold.
:::

---

## Troubleshooting

| Issue | What to do |
|-------|-----------|
| Meta connection drops or stops working | Go to **Social Media > Meta > Connected Accounts** and click **Refresh Connection** |
| Ad account or page not appearing after connect | Ensure you have admin access in Meta Business Manager, then reconnect |
| Audience export fails | Check that the correct advertiser account is selected and that the platform connection is still active |
| Segment too small to target | Expand your segment filters to increase the audience size before exporting |
