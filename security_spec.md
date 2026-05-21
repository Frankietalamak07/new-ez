# Security Specification - EZStep Booking System

## Data Invariants
1. A booking must have a valid `clinicId` corresponding to an existing clinic (though rules don't strictly check existence of clinicId if it's external, we validate format).
2. A user can only read their own bookings.
3. Bookings cannot be modified after they are 'cancelled' or 'confirmed' EXCEPT by an admin.
4. `createdAt` is immutable and must be server-time.

## The "Dirty Dozen" Payloads (Refusal Criteria)
1. **Identity Spoofing**: Attempt to create a booking for another user by setting `userId` to a different UID.
2. **Resource Poisoning**: Injection of a 1MB string into the `customerName` field.
3. **State Shortcutting**: Creating a/updating a booking with `status: 'confirmed'` without admin privileges.
4. **ID Poisoning**: Using a 5KB string as the `bookingId`.
5. **PII Leakage**: Authenticated non-owner attempts to 'get' another user's booking.
6. **Orphaned Write**: Creating a booking without a `clinicId`.
7. **Temporal Fraud**: Setting a manual `createdAt` timestamp from the client.
8. **Privilege Escalation**: User attempts to update their own role by modifying an `admins` collection document.
9. **Shadow Data**: Including an `isPaid: true` field in a booking during creation.
10. **Query Scrape**: Attempting to list ALL bookings without a filter on `userId`.
11. **Malicious Update**: User attempts to update the `clinicId` of an existing booking.
12. **Format Injection**: Providing a `date` field in format `DD/MM/YYYY` instead of `YYYY-MM-DD`.

## Test Runner Logic
The `firestore.rules` will verify:
- `request.auth.uid` matches `incoming().userId` if present.
- `incoming().keys().hasOnly([...])` to prevent shadow fields.
- `.size()` checks on all string inputs.
- `request.time` enforcement.
