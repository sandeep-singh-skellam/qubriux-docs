import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "api-documentation/loyalty/qubriux-loyalty-open-api",
    },
    {
      type: "category",
      label: "Authentication",
      items: [
        {
          type: "doc",
          id: "api-documentation/loyalty/get-access-token",
          label: "Issue a JWT access token",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Customer",
      items: [
        {
          type: "doc",
          id: "api-documentation/loyalty/create-customer",
          label: "Register a new customer",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-documentation/loyalty/update-customer",
          label: "Update an existing customer's profile",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Rewards",
      items: [
        {
          type: "doc",
          id: "api-documentation/loyalty/get-customer-offers",
          label: "Get available offers and loyalty status for a customer",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-documentation/loyalty/validate-reward",
          label: "Validate reward eligibility for a customer order",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-documentation/loyalty/apply-coupon",
          label: "Apply a specific coupon code to an order",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-documentation/loyalty/reward-redeemed",
          label: "Confirm a reward redemption after transaction completion",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Loyalty",
      items: [
        {
          type: "doc",
          id: "api-documentation/loyalty/get-customer-loyalty-points-tx",
          label: "Retrieve a customer's loyalty points transaction history",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-documentation/loyalty/get-loyalty-tier-benefits",
          label: "Retrieve loyalty tier benefit definitions",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-documentation/loyalty/get-loyalty-tier-description",
          label: "Retrieve descriptive loyalty tier rules",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Merchant",
      items: [
        {
          type: "doc",
          id: "api-documentation/loyalty/get-merchant-details",
          label: "Retrieve merchant admin configuration",
          className: "api-method post",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
