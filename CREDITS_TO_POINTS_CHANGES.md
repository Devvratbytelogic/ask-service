# User-facing text: “crédits” → “Points”

Date: 2026-08-12

## Summary

Every user-facing occurrence of **crédits** / **Crédits** was replaced with **Points**.  
Code identifiers, API routes, variable names, and keys (e.g. `creditsToUnlock`, `/vendor/credits`, `low_credits`) were left unchanged so functionality is unaffected.

## Files changed

| File | Change |
|------|--------|
| `src/components/pages/auth/login/LoginMixedCategoryLeads.tsx` | `{n} crédits` → `{n} Points` |
| `src/components/common/Header/VendorActions.tsx` | Tooltip and label: `crédits` → `Points` |
| `src/components/common/Header/Header.tsx` | `Mes crédits` → `Mes Points` |
| `src/components/vendor/dashboard/VendorDashboardOverview.tsx` | `Solde de crédits` → `Solde de Points`; `Acheter des crédits` → `Acheter des Points` |
| `src/components/vendor/dashboard/lead/LeadCard.tsx` | `{n} crédits` → `{n} Points` |
| `src/components/vendor/dashboard/lead/LeadMobileUnlockBar.tsx` | Wallet/unlock labels: `crédits` → `Points` |
| `src/components/vendor/dashboard/lead/UnlockPanel.tsx` | Deduction/wallet labels: `crédits` → `Points` |
| `src/components/vendor/dashboard/lead/UnlockLeadConfirmModal.tsx` | Confirm modal copy: `crédits` → `Points` |
| `src/components/vendor/credits/PurchaseCreditsModal.tsx` | `Achat de crédits` → `Achat de Points` |
| `src/components/pages/my-account/NotificationPreferences.tsx` | Notification titles/descriptions: `crédits`/`Crédits` → `Points` |
| `src/components/pages/my-account/VendorPaymentHistory.tsx` | `Crédits ajoutés` → `Points ajoutés` |
| `src/components/pages/contact-us/ContactFaq.tsx` | Tab label: `Crédits & Prospects` → `Points & Prospects` |
| `src/components/pages/HomePage/HowDoesItWorkSection.tsx` | `Déverrouillez avec des crédits` → `Déverrouillez avec des Points` |
| `src/components/pages/ServiceProviderPage/ServiceProviderBenefits.tsx` | Marketing copy: `crédits` → `Points` |
| `src/components/pages/ServiceProviderPage/ServiceProviderTestimonials.tsx` | Testimonial copy: `crédits` → `Points` |
| `src/components/pages/ServiceProviderPage/ServiceProviderHowItWorks.tsx` | How-it-works copy: `crédits` → `Points` |
| `src/app/terms/page.tsx` | Terms definitions and legal copy: `crédits`/`Crédits` → `Points` |
| `ENGLISH_STRINGS.md` | Mapping updated: Credits → Points |

## Already using “Points” (no change needed)

These already displayed **Points** (or abbreviated **pts**) and were not modified for this rename:

- `src/components/vendor/credits/CreditsWallet.tsx` — e.g. “Points & Portefeuille”, “Acheter des Points”
- `src/components/vendor/dashboard/VendorDashboard.tsx` — `{n} Points`
- `src/components/vendor/dashboard/lead/LeadListView.tsx` — `{n} pts`
- `src/components/vendor/dashboard/lead/LeadSidebar.tsx` — `{n} pts`

## Intentionally unchanged

- Route paths (`/vendor/credits`, `getCreditsRoutePath()`)
- API endpoints and Redux query names
- TypeScript/property names (`credits`, `creditsToUnlock`, `creditBalance`, etc.)
- Notification preference keys (`low_credits`, `low_credit_balance`)
- FAQ tab key (`credits-leads`) — only the visible label was updated
