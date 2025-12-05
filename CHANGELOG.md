# Changelog

## [Unreleased] - 2025-12-04

### Added
- QR-based attendance system implementation
- Live QR page with auto-refresh every 10 minutes
- Manual QR regeneration button for admins
- QR token validation on attendance marking
- Integration with backend API v1
- Support for snake_case API responses
- Automatic token refresh mechanism
- User profile fetching after login

### Changed
- **BREAKING**: Updated API endpoints from `/admin/qr/*` to `/qr/*`
- **BREAKING**: Changed request/response format from camelCase to snake_case
  - `qrToken` → `qr_token`
  - `expiresAt` → `expires_at`
  - `refreshToken` → `refresh_token`
  - `accessToken` → `access_token`
- Updated User interface to match backend schema
  - Added `first_name`, `last_name`, `department_id`, `is_active`, `created_at`, `updated_at`
  - Changed `id` from string to number
  - Updated role options: `'admin' | 'manager' | 'employee'`
- Improved error handling with proper error message extraction
- Login flow now calls `/auth/login` then `/users/me` to get user data

### Removed
- Removed manual check-in/check-out endpoints (replaced with QR-based system)
- Removed camelCase property names

### Fixed
- Fixed authentication flow to properly handle two-step login process
- Fixed refresh token endpoint to save both access and refresh tokens
- Fixed DashboardPage to display user's full name

## API Contract Updates

### New Endpoints
- `GET /qr/active` - Get currently active QR code (Admin only)
- `POST /qr/generate` - Force generation of new QR code (Admin only)
- `POST /attendance/mark` - Mark attendance using QR token

### Removed Endpoints
- `POST /attendance/check-in` (replaced by QR-based marking)
- `POST /attendance/check-out` (replaced by QR-based marking)

### Modified Endpoints
- `POST /auth/login` - Now returns only tokens, requires separate call to `/users/me`
- `POST /auth/refresh` - Now returns both `access_token` and `refresh_token`

## Environment Variables

```env
# Required
VITE_API_URL=http://localhost:8080/api/v1

# Note: Must include /api/v1 suffix
```

## Dependencies

No new dependencies added in this release.

## Migration Notes

If upgrading from a previous version:

1. Update `.env` file to use `/api/v1` instead of `/api`
2. Backend must implement new QR endpoints
3. Backend must use snake_case for all responses
4. Clear localStorage to avoid token format conflicts
5. Rebuild frontend: `npm run build`

## Known Issues

- Node.js version warning (requires 20.19+ or 22.12+, currently tested with 20.4.0)
- Preview mode works, but dev mode requires newer Node.js version

## Contributors

- Frontend changes by Antigravity AI Assistant
- Backend contract defined in collaboration with development team
