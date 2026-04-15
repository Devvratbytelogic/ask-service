# English Strings Inventory

All hardcoded English text found across the project, organized by file location.

---

## Components — Common

### `src/components/common/AppLoader.tsx`

| String | Context |
|--------|---------|
| `"Loading..."` | Default message prop |

### `src/components/common/Header/Header.tsx`

| String | Context |
|--------|---------|
| `"U"` | Fallback initial |
| `"Utilisateur"` | Fallback name |
| `"User"` | Role string |
| `"Vendor"` | Role string |
| `"99+"` | Unread badge overflow |

### `src/components/common/Header/NavbarComponent.tsx`

| String | Context |
|--------|---------|
| `"login_logout"` | img_title |
| `"login"` | img_title |
| `"arrow"` | img_title |

### `src/components/common/message/ChatHeader.tsx`

| String | Context |
|--------|---------|
| `"Unknown"` | Fallback name |
| `"Select a conversation"` | Empty state |
| `"Back to messages"` | aria-label |
| `"Profile"` | Menu option |
| `"Report"` | Menu option |

### `src/components/common/message/MessageLayout.tsx`

| String | Context |
|--------|---------|
| `"Remove"` | Button text |
| `"Vendor"` | Socket display name |
| `"User"` | Socket display name |
| `"Upload image"` | aria-label |
| `"Upload document"` | aria-label |
| `"Attach document"` | aria-label |
| `"Send image"` | aria-label |
| `"Emoji"` | aria-label |
| `"Send"` | aria-label |
| `"Remove attachment"` | aria-label |

### `src/components/common/message/MessagesChatBox.tsx`

| String | Context |
|--------|---------|
| `"Read"` | aria-label |
| `"Sent"` | aria-label |
| `"Shared image"` | img_title |
| `"Document"` | Fallback filename |
| `"Unknown"` | Sender fallback |

### `src/components/common/message/MessagesList.tsx`

| String | Context |
|--------|---------|
| `"Unknown"` | Fallback name |
| `"vendor"` | Role check |
| `"Messages"` | Section heading |
| `"New message"` | aria-label |
| `"Favorites"` | aria-label |
| `"Search"` | Placeholder |

---

## Components — Library

### `src/components/library/DocumentUploadCard.tsx`

| String | Context |
|--------|---------|
| `"Identity Proof"` | Default title |
| `"PDF, JPG, PNG (Max 5MB)"` | Default description |
| `"REQUIRED"` | Badge text |
| `"Uploaded"` | Status text |
| `"Drag and drop your file here"` | Default drag label |
| `"Browse files"` | Default browse label |
| `` `Upload ${title}` `` | Upload heading |

### `src/components/library/FileUploadZone.tsx`

| String | Context |
|--------|---------|
| `"Drag and drop your file here"` | Default drag label |
| `"Browse files"` | Default browse label |
| `"Upload file"` | Default heading |
| `"Remove file"` | aria-label |
| `"or"` | Separator text |
| `" B"`, `" MB"` | File size units |

### `src/components/library/ImageComponent.tsx`

| String | Context |
|--------|---------|
| `"Image unavailable"` | aria-label fallback |
| `"title not found"` | alt text fallback |

### `src/components/library/OtpInput.tsx`

| String | Context |
|--------|---------|
| `"Digit"` | aria-label prefix |

---

## Components — Modals

### `src/components/modals/MobileOtpVerification.tsx`

| String | Context |
|--------|---------|
| `"Failed to send code."` | Error fallback |
| `"Failed to resend code."` | Error fallback |
| `"The code you entered is incorrect. Please try again."` | Validation error |
| `"Signed in as"` | Label |
| `"Phone number"` | Label & aria-label |
| `"Change phone number"` | aria-label |

### `src/components/modals/VerifyEmailOtpModal.tsx`

| String | Context |
|--------|---------|
| `"Email icon"` | img_title |
| `"A {OTP_LENGTH}-digit code has been sent to"` | Instruction text |

---

## Components — Login / Signup Flow

### `src/components/pages/LoginSignupFlow/LoginSignupIndex.tsx`

| String | Context |
|--------|---------|
| `"Ask Service"` | Fallback brand name |
| `"Close and go to Ask Service"` | aria-label |
| `"logo"` | img_title |

### `src/components/pages/LoginSignupFlow/CustomerSignInFlow/CustomerSignInDetails.tsx`

| String | Context |
|--------|---------|
| `"Go back"` | aria-label |
| `"example@xyz.com"` | Placeholder |

### `src/components/pages/LoginSignupFlow/CustomerSignInFlow/CustomerSignInIndex.tsx`

| String | Context |
|--------|---------|
| `"Or"` | Separator |

### `src/components/pages/LoginSignupFlow/CustomerSignupFlow/CustomerSignupDetails.tsx`

| String | Context |
|--------|---------|
| `"Go back"` | aria-label |
| `"example@xyz.com"` | Placeholder |

### `src/components/pages/LoginSignupFlow/CustomerSignupFlow/CustomerSignupIndex.tsx`

| String | Context |
|--------|---------|
| `"or"` | Separator |

### `src/components/pages/LoginSignupFlow/ForgotPasswordFlow/ForgotPasswordEnterIdentifier.tsx`

| String | Context |
|--------|---------|
| `"Go back"` | aria-label |
| `"Email"` | Label |
| `"exemple@xyz.com"` | Placeholder |

### `src/components/pages/LoginSignupFlow/VendorSignupFlow/VendorDocumentVerification.tsx`

| String | Context |
|--------|---------|
| `"Loading required documents..."` | Loading state |
| `"Failed to load required documents. Please try again."` | Error state |

### `src/components/pages/LoginSignupFlow/VendorSignupFlow/VendorServiceListPage.tsx`

| String | Context |
|--------|---------|
| `"Loading services..."` | Loading state |
| `"Failed to load services. Please try again."` | Error state |

### `src/components/pages/LoginSignupFlow/VendorSignupFlow/VendorSignupDetails.tsx`

| String | Context |
|--------|---------|
| `"or"` | Separator |
| `"Google login icon"` | img_title |

---

## Components — HomePage

### `src/components/pages/HomePage/Services/ServicesWeOfferIndex.tsx`

| String | Context |
|--------|---------|
| `"Previous slide"` | aria-label |
| `"Next slide"` | aria-label |

### `src/components/pages/HomePage/SmartHiring/SmartHiringIndex.tsx`

| String | Context |
|--------|---------|
| `"Smart Hiring Made Easy"` | Card heading |
| `"Verified Professionals"` | Card heading |
| `"Quick Turnaround"` | Card heading |
| `"Affordable Pricing"` | Card heading |
| `"Customer Support"` | Card heading |
| `"Satisfaction Guaranteed"` | Card heading |
| _(+ descriptions for each card)_ | Card body text |

---

## Components — Request Service Flow

### `src/components/pages/RequestServiceFlow/RequestServiceFlowIndex.tsx`

| String | Context |
|--------|---------|
| `"Phone verification required"` | API error match |
| `"Email verification required"` | API error match |
| `LOGIN_REQUIRED_MESSAGES` | English API match strings |

### `src/components/pages/RequestServiceFlow/SubmissionSuccess.tsx`

| String | Context |
|--------|---------|
| `"Your request has been submitted successfully!"` | Success title |
| `"What happens next?"` | Section heading |
| `"Check your email"` | CTA |
| `"Return to dashboard"` | CTA |
| `"Need help?"` | Help label |
| `"support@example.com"` | Support email |
| `WHAT_HAPPENS_NEXT` — 4 step titles & descriptions | Step-by-step guide |

---

## Components — My Request

### `src/components/pages/my-request/AllRequests.tsx`

| String | Context |
|--------|---------|
| `` `This request will stay open for ${quoteExpired} days. After that, it will close automatically.` `` | Tooltip |
| `"Preferred start"` | Label |

### `src/components/pages/my-request/QuoteDetailModal.tsx`

| String | Context |
|--------|---------|
| `"Quote not found"` | Empty state |
| `"Close"` | Button |

### `src/components/pages/my-request/ViewQuoteModal.tsx`

| String | Context |
|--------|---------|
| `"Unknown Service"` | Fallback |
| `"Unknown Request"` | Fallback |
| `"Unknown Date"` | Fallback |
| `"Unknown Location"` | Fallback |

---

## Components — My Account

### `src/components/pages/my-account/SecuritySettings.tsx`

| String | Context |
|--------|---------|
| `"Current Password"` | Label |
| `"Enter current password"` | Placeholder |
| `"New Password"` | Label |
| `"Enter new password"` | Placeholder |
| `"Must be at least 8 characters..."` | Hint |
| `"Confirm New Password"` | Label |
| `"Confirm new password"` | Placeholder |
| `"Update password"` | Button |

### `src/components/pages/my-account/VendorDocuments.tsx`

| String | Context |
|--------|---------|
| `"Identity Proof"` | Fallback doc type |
| `"Trade License"` | Fallback doc type |
| `"Compliance Declaration"` | Fallback doc type |
| `"No documents found"` | Empty state |

### `src/components/pages/my-account/VendorPaymentHistory.tsx`

| String | Context |
|--------|---------|
| `"Date range"` | aria-label |
| `"Filter by status"` | aria-label |
| `"Download options"` | aria-label |
| `"Download invoice"` | aria-label |
| `"Items per page"` | aria-label |
| `"Search"` | aria-label |

### `src/components/pages/my-account/ProfileInfo.tsx`

| String | Context |
|--------|---------|
| `"Upload profile picture"` | aria-label |
| `"Profile"` | aria-label |

---

## Components — Vendor Dashboard

### `src/components/vendor/dashboard/VendorDashboard.tsx`

| String | Context |
|--------|---------|
| `"Service category filter"` | aria-label |
| `"Sort filter"` | aria-label |

### `src/components/vendor/dashboard/lead/LeadFullDetails.tsx`

| String | Context |
|--------|---------|
| `"Loading lead details..."` | Loading state |
| `"No lead data found."` | Empty state |
| `"Frequency"` | Label |
| `"Requested Tasks"` | Section heading |
| `"Preferred Start Date"` | Label |
| `"Preferred Time"` | Label |
| `"Start Date"` | Label |
| `"Start Time"` | Label |
| `"End Date"` | Label |
| `"End Time"` | Label |
| `"N/A"` | Fallback |

### `src/components/vendor/dashboard/lead/LeadHeader.tsx`

| String | Context |
|--------|---------|
| `"{creditsToUnlock} Credits"` | Credit cost |
| `"to unlock"` | Label |

### `src/components/vendor/dashboard/lead/SubmitQuoteForm.tsx`

| String | Context |
|--------|---------|
| `"Quote valid for"` | aria-label |

---

## Components — Vendor Profile

### `src/components/vendor/profile/LeaveReviewModal.tsx`

| String | Context |
|--------|---------|
| `"Leave a Review"` | Modal title |
| `"Select your request ID"` | Label |
| `"Your Review"` | Label |
| `"Share your experience..."` | Placeholder |

### `src/components/vendor/profile/ReportProfileModal.tsx`

| String | Context |
|--------|---------|
| `"Report this profile"` | Modal title |
| `"Reason for reporting"` | Label |
| `"Select a reason"` | Placeholder |
| `"Important"` | Notice heading |
| `"Submit"` | Button |

### `src/components/vendor/profile/ReportSubmittedModal.tsx`

| String | Context |
|--------|---------|
| `"Report Submitted"` | Title |
| `"We've sent a confirmation email to"` | Body text |
| `"Close"` | Button |

### `src/components/vendor/profile/VendorAbout.tsx`

| String | Context |
|--------|---------|
| `"About"` | Section title |
| `"Overview"` | Section title |
| `"In operation for"` | Label |
| `"Employees"` | Label |
| `"Response time"` | Label |
| `"Contact Information"` | Section title |

### `src/components/vendor/profile/VendorLinks.tsx`

| String | Context |
|--------|---------|
| `"Links"` | Section heading |

### `src/components/vendor/profile/VendorProfileDetails.tsx`

| String | Context |
|--------|---------|
| `"About"` | Tab title |
| `"Reviews"` | Tab title |
| `"Links"` | Tab title |
| `"Services"` | Tab title |

### `src/components/vendor/profile/VendorReviews.tsx`

| String | Context |
|--------|---------|
| `"Helpful ({review.helpfulCount})"` | Button text |

### `src/components/vendor/profile/VendorServices.tsx`

| String | Context |
|--------|---------|
| `"Services"` | Section heading |

---

## Components — Vendor Credits

### `src/components/vendor/credits/BillingInfoModal.tsx`

| String | Context |
|--------|---------|
| `"Business name is required"` | Yup validation |
| `"Business address is required"` | Yup validation |
| `"Postcode is required"` | Yup validation |
| `"City is required"` | Yup validation |
| `"VAT number is required"` | Yup validation |
| `"Company registration number is required"` | Yup validation |
| `"Billing Information Required"` | Modal title |
| `"Please fill in your billing details before proceeding to payment."` | Modal description |

### `src/components/vendor/credits/CreditsWallet.tsx`

| String | Context |
|--------|---------|
| `"Dismiss"` | aria-label |
| `"Period filter"` | aria-label |
| `"Download format"` | aria-label |
| `"Download invoice"` | aria-label |
| `"Items per page"` | aria-label |
| `"Search"` | aria-label |
| `"No payment URL returned"` | Error message |

### `src/components/vendor/credits/PurchaseCreditsModal.tsx` _(commented-out block)_

| String | Context |
|--------|---------|
| `"Purchase Credits"` | Modal title |
| `"Contact information"` | Section heading |
| `"Complete Purchase"` | Button |

---

## App Pages

### `src/app/layout.tsx`

| String | Context |
|--------|---------|
| `"Ask Service"` | Metadata title |
| `"Ask for help and let us handle that - Ask Service"` | Metadata description |

### `src/app/contact-us/page.tsx`

| String | Context |
|--------|---------|
| `"Address"` | Label |
| `"Email"` | Label |

### `src/app/vendor-profile/page.tsx`

| String | Context |
|--------|---------|
| `"Loading profile..."` | Loading state |
| `"Failed to load profile."` | Error state |
| `"Something went wrong."` | Error state |

### `src/app/vendor/support/page.tsx`

| String | Context |
|--------|---------|
| `"Coming soon"` | Heading |
| `"We're building something helpful. Check back soon."` | Body text |

### `src/app/api/razorpay/create-order/route.ts`

| String | Context |
|--------|---------|
| `"Razorpay keys not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local"` | Server error |
| `"Failed to create order"` | Error response |

---

## Utilities

### `src/utils/validation.ts`

| String | Context |
|--------|---------|
| `"Email is required"` | Yup validation |
| `"Passwords must match"` | Yup validation |

### `src/utils/constant_var.ts`

| String | Context |
|--------|---------|
| `"One-time service"` | Frequency option value |
| `"Daily"` | Frequency option value |
| `"Weekly"` | Frequency option value |
| `"Bi-weekly"` | Frequency option value |
| `"Monthly"` | Frequency option value |
| `"Morning"` | Time preference value |
| `"Afternoon"` | Time preference value |
| `"Evening"` | Time preference value |
| `"Flexible"` | Time preference value |

### `src/utils/serviceList.ts`

| String | Context |
|--------|---------|
| `"Security"` | Service category |
| `"Gardening"` | Service category |
| `"House Cleaning"` | Service category |
| `"Home Maintenance"` | Service category |
| `"Business Service"` | Service category |
| `"General cleaning"` | Sub-service |
| `"Floor cleaning"` | Sub-service |
| `"Window Cleaning"` | Sub-service |
| `"Restroom/ sanitary apartment"` | Sub-service |
| `"Kitchen / break room"` | Sub-service |
| `"Waste removal"` | Sub-service |
| `"Deep cleaning"` | Sub-service |

### `src/utils/authCookies.ts`

| String | Context |
|--------|---------|
| `"unauthorized"` | API error match |
| `"invalid token"` | API error match |
| `"token expired"` | API error match |

---

## Firebase

### `src/firebase/GoogleLogin.ts`

| String | Context |
|--------|---------|
| `"Firebase auth not supported in this environment"` | Error |
| `"Google login failed"` | Error |
| `"Login Failed"` | Console error |
| `"PHONE_VERIFICATION_REQUIRED"` | Status code |

### `src/firebase/getFcmTokenn.ts`

| String | Context |
|--------|---------|
| `"[FCM] Invalid VAPID key..."` | Long error message |
| `"Notification"` | Default notification title |
| `"[FCM] Cookie set failed:"` | Log prefix |
| `"[FCM] registerForegroundMessageHandler failed:"` | Log prefix |

### `src/firebase/GenrateFirebaseToken.ts`

| String | Context |
|--------|---------|
| `"Error fetching Firebase ID token:"` | Console error |

---

## Providers

### `src/providers/AppProvider.tsx`

| String | Context |
|--------|---------|
| `"[FCM] AppProvider: no FCM token (permission denied or unsupported)"` | Console warning |

---

## Redux / API

### `src/redux/services/rtkQuerieSetup.ts`

| String | Context |
|--------|---------|
| `"Unknown API error"` | Fallback error |

---

## Hooks

### `src/hooks/useChatSocket.ts`

| String | Context |
|--------|---------|
| `"message received"` | Socket event |
| `"new message"` | Socket event |
| `"typing"` | Socket event |
| `"stop typing"` | Socket event |
| `"setup"` | Socket event |
| `"join chat"` | Socket event |
| `"message:seen"` | Socket event |
| `"[ChatSocket] Connected and joined chat"` | Dev log |
| `"[ChatSocket] Connection error"` | Dev log |
