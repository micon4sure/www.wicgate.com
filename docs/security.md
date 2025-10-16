# Security Guidelines

**Last Updated:** October 16, 2025
**Status:** Active Development

This document outlines security practices, known vulnerabilities, and mitigation strategies for the WiCGATE project.

---

## Table of Contents

1. [XSS Prevention](#xss-prevention)
2. [Authentication Security](#authentication-security)
3. [API Security](#api-security)
4. [Storage Security](#storage-security)
5. [Recommended Enhancements](#recommended-enhancements)

---

## XSS Prevention

### Server Name Rendering with `v-html`

**Affected Files:**
- `src/screens/Multiplayer.vue:130`
- `src/components/widgets/LiveServersWidget.vue:75`

**Current Implementation:**
Server names are rendered using `v-html` to support color markers (e.g., `<#ff0000>RedServer</>`).

**Security Analysis:**
- ✅ **Hex validation** prevents CSS injection (`usePlayerDisplay.ts:76`)
- ✅ **Server names** are admin-controlled (not user-submitted)
- ✅ **Color parsing** uses regex to validate hex codes before rendering

**Risk Assessment:** **LOW**

Server names are controlled by server owners and validated before storage. The colorize function validates all hex codes to prevent malicious CSS injection.

**Validation Code:**
```typescript
// src/composables/usePlayerDisplay.ts:75-81
if (m[1]) {
  const hexColor = m[1];
  if (/^[\da-f]{3,6}$/i.test(hexColor)) {  // ✅ Strict validation
    if (open) out += '</span>';
    out += `<span style="color:#${hexColor}">`;
    open = true;
  }
}
```

**Future Enhancement:**
If user-submitted server names are added, implement DOMPurify sanitization:

```typescript
import DOMPurify from 'dompurify';

function colorize(name: string): string {
  const htmlOutput = colorizeInternal(name);
  return DOMPurify.sanitize(htmlOutput);
}
```

---

### Static Content `v-html` (SAFE)

**Affected Files:**
- `src/screens/GettingStarted.vue:70,173,306`

**Status:** ✅ **SAFE**

Content rendered comes from static `content.ts` file, which contains:
- Download links (controlled by developers)
- Installation instructions (static content)
- No user-generated content

**Risk Assessment:** **NONE**

---

## Authentication Security

### Mock Authentication (CRITICAL ISSUE)

**Status:** ⚠️ **NOT PRODUCTION-READY**

**Current Implementation:**
- Hardcoded credentials in `src/stores/auth.ts`
- Mock JWT tokens (simple string concatenation)
- No password hashing
- No session expiration
- No CSRF protection

**Credentials:**
```typescript
admin / admin123
user / user123
```

**Risk Assessment:** **CRITICAL if deployed to production**

**Safeguards in Place:**
1. ✅ Prominent warning banner in Admin dashboard
2. ✅ Warning banner on Login page
3. ✅ Production console error if deployed

**Required for Production:**
- [ ] Replace with real authentication backend (e.g., Auth0, Firebase, custom backend)
- [ ] Implement password hashing (bcrypt/argon2)
- [ ] Use JWT with expiration and refresh tokens
- [ ] Add CSRF tokens for state-changing operations
- [ ] Implement rate limiting on login attempts
- [ ] Add session management with httpOnly cookies

---

## API Security

### API Endpoint Protection

**Current State:**
- Mock API responses for development
- No authentication required for public endpoints
- No rate limiting

**Recommendations:**
1. **Add CORS headers** - Restrict to known domains
2. **Implement rate limiting** - Prevent API abuse
3. **Add request signing** - HMAC signatures for integrity
4. **API versioning** - Future-proof breaking changes
5. **Input validation** - Validate all API inputs server-side

---

## Storage Security

### localStorage Usage

**Current Implementation:**
- Auth token stored in `localStorage` under `wicgate_auth_token`
- No encryption
- XSS can access tokens

**Risk Assessment:** **MEDIUM**

**Recommendations:**
1. **Use httpOnly cookies** for production auth tokens
2. **Implement token encryption** if localStorage is required
3. **Add token rotation** - Refresh tokens periodically
4. **Monitor token access** - Detect suspicious activity

---

## Recommended Enhancements

### Phase 1: Immediate (Before Production)
- [ ] Replace mock authentication with real backend
- [ ] Implement HTTPS-only deployment
- [ ] Add Content Security Policy headers
- [ ] Enable CORS with strict origins
- [ ] Add rate limiting middleware

### Phase 2: High Priority
- [ ] Implement DOMPurify for all v-html rendering
- [ ] Add input sanitization on backend
- [ ] Implement CSRF protection
- [ ] Add security headers (HSTS, X-Frame-Options, etc.)
- [ ] Conduct security audit

### Phase 3: Medium Priority
- [ ] Add request signing for API calls
- [ ] Implement token refresh mechanism
- [ ] Add session management
- [ ] Enable two-factor authentication (2FA)
- [ ] Add security logging and monitoring

---

## Vulnerability Reporting

If you discover a security vulnerability, please:

1. **DO NOT** open a public GitHub issue
2. Email security concerns to: [micon4sure@wicgate.com]
3. Include steps to reproduce
4. Allow 48 hours for initial response

---

## Security Checklist for Deployment

Before deploying to production:

- [ ] Mock authentication removed/disabled
- [ ] HTTPS enforced for all traffic
- [ ] Content Security Policy configured
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (if using SQL)
- [ ] XSS protection verified
- [ ] CSRF tokens implemented
- [ ] Security headers configured
- [ ] Error messages don't leak sensitive info
- [ ] Secrets stored in environment variables
- [ ] Dependencies audited (`npm audit`)
- [ ] Security scan completed

---

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Vue Security Best Practices](https://vuejs.org/guide/best-practices/security.html)
- [Content Security Policy Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)

---

**Questions?** Join the discussion in `#security` on Discord or contact the development team.
