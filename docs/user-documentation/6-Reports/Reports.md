---
sidebar_position: 1
title: Reports
---

# Reports

Qubriux Reports lets you generate detailed, filtered data exports across key modules - Offers, Loyalty, Segmentation, A/B Testing, and Membership. Reports can be previewed inline before exporting, and full exports are delivered directly to your email as a file.

## Available Report Modules

Reports are organised by module. Navigate to **Reports** and select the module you want to report on:

| Module | What It Covers |
|--------|---------------|
| **Offer** | Offer issuance, redemption, and performance data |
| **Loyalty** | Points earned, redeemed, tier movements, and loyalty activity |
| **Segmentation** | Customer counts and composition per segment |
| **A/B Testing** | Results and performance comparison across A/B test variants |
| **Membership** | Membership enrolments, status, and activity |
| **Membership Check-In** | Customer check-in history against membership records |

## Browsing Reports

1. Navigate to **Reports**.
2. Select a **module** from the list (e.g. Loyalty, Offer).
3. All available reports for that module are shown with their name and description.

## Applying Filters

Each report has its own set of filters to help you scope the data before generating it. Filters vary by report but commonly include date ranges, specific segments, offer IDs, or store selections.

Filter types:
- **Dropdown** - select a single value from a predefined list
- **Multi-select Dropdown** - select one or more values from a list
- Required filters must be filled before the report can be run; optional filters further narrow the data.

To apply filters:
1. Open the report you want to run.
2. The filter panel loads the available filters for that report.
3. Set your required and optional filter values.
4. Click **Preview** or **Export**.

## Previewing a Report

Before exporting, you can preview the report data inline:

1. Set your filters.
2. Click **Preview**.
3. Qubriux runs the query and displays the report data in a table directly on screen.

:::note
Some reports have preview disabled by design - for these, you must use the full export flow.
:::

## Exporting a Report

Full exports are generated asynchronously and delivered to your email:

1. Set your filters.
2. Click **Export**.
3. Enter or confirm the **email address** to receive the report.
4. Click **Confirm**.

Qubriux queues the report for generation and sends it to the specified email address once ready. You will receive a message: *"You will receive the requested report on an email shortly."*

:::tip
For large date ranges or high-volume merchants, report generation may take a few minutes. The report is sent as soon as it is ready - you do not need to stay on the page.
:::

## Saving a Custom Report

If you have configured a specific report with filters you use regularly, you can save it for quick access in future:

1. Configure your report and filters.
2. Click **Save Report**.
3. The report configuration is saved to your account and appears in the reports list for that module.
