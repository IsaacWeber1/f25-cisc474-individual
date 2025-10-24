# How to Get Auth0 Token from Browser Console

## The Problem
`window.$AUTH0` doesn't exist because Auth0 is wrapped in React context, not exposed globally.

## Solution: Use React DevTools

### Method 1: React Developer Tools
1. **Install React Developer Tools** browser extension if not already installed
2. **Open DevTools** (F12) and go to **Components** tab
3. **Search for** `Auth0Provider` in the component tree
4. **Click on it** to select
5. **In the console**, the selected component is available as `$r`
6. **Run these commands**:

```javascript
// After selecting Auth0Provider in React DevTools
$r.props.children.props.value.getAccessTokenSilently().then(token => {
  console.log('Token:', token);
  copy(token);
  console.log('✅ Token copied to clipboard!');
});
```

### Method 2: Find Auth0 in React Fiber (No DevTools needed)
```javascript
// This searches React's internal fiber tree for Auth0 context
function findAuth0() {
  const rootElement = document.getElementById('root') || document.querySelector('[data-reactroot]') || document.body.firstElementChild;
  const key = Object.keys(rootElement).find(key => key.startsWith('__reactInternalInstance') || key.startsWith('__reactFiber'));

  let fiber = rootElement[key];

  while (fiber) {
    // Look for Auth0Provider in the fiber tree
    if (fiber.memoizedProps && fiber.memoizedProps.domain && fiber.memoizedProps.getAccessTokenSilently) {
      return fiber.memoizedProps;
    }

    // Check children
    if (fiber.child) {
      const result = checkFiber(fiber.child);
      if (result) return result;
    }

    fiber = fiber.sibling || fiber.return;
  }

  function checkFiber(node) {
    while (node) {
      if (node.memoizedProps && node.memoizedProps.getAccessTokenSilently) {
        return node.memoizedProps;
      }
      if (node.child) {
        const result = checkFiber(node.child);
        if (result) return result;
      }
      node = node.sibling;
    }
  }

  console.error('Auth0 context not found');
  return null;
}

// Run this to get token
const auth0 = findAuth0();
if (auth0 && auth0.getAccessTokenSilently) {
  auth0.getAccessTokenSilently().then(token => {
    console.log('Token:', token);
    copy(token);
    console.log('✅ Token copied to clipboard!');
  });
}
```

### Method 3: Intercept Network Requests
```javascript
// This captures tokens from actual API calls
(function captureToken() {
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    return originalFetch.apply(this, args).then(response => {
      const authHeader = args[1]?.headers?.['Authorization'];
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.replace('Bearer ', '');
        console.log('🎯 Captured token from API call!');
        console.log('Token:', token);
        copy(token);
        console.log('✅ Token copied to clipboard!');
        // Restore original fetch
        window.fetch = originalFetch;
      }
      return response;
    });
  };
  console.log('Token capture enabled. Navigate to a page that makes API calls...');
})();
```

### Method 4: Check Application State (TanStack Query)
```javascript
// If the app uses TanStack Query, tokens might be in the cache
const queryClient = window.__TANSTACK_QUERY_CLIENT__;
if (queryClient) {
  // This would need the actual query key structure
  const cache = queryClient.getQueryCache();
  console.log('Query cache:', cache);
}
```

## Testing the Token

Once you have the token (it's copied to your clipboard), test it:

```bash
# In terminal (paste the token)
TOKEN="paste_your_token_here"

# Test protected endpoints
curl http://localhost:3000/courses \
  -H "Authorization: Bearer $TOKEN" | jq .

curl http://localhost:3000/users/me \
  -H "Authorization: Bearer $TOKEN" | jq .

# Decode the token
echo $TOKEN | cut -d. -f2 | base64 -d 2>/dev/null | jq .
```

## If Auth0 Login Isn't Working

1. **Check Auth0 Configuration**:
   - Callback URL: `http://localhost:3001/home`
   - Allowed Web Origins: `http://localhost:3001`
   - Audience: `http://localhost:3000/`

2. **Check Browser Console for Errors**:
   ```javascript
   // Look for Auth0 errors
   console.log(window.location.search); // Check for error parameters
   ```

3. **Verify Auth0 is Loaded**:
   ```javascript
   // Check if Auth0Provider is in the React tree
   console.log(React.version);
   console.log(document.querySelector('#root')._reactRootContainer);
   ```

## Alternative: Create a Debug Button

Add this temporarily to a component to expose the token getter:

```typescript
// In any component that uses useAuth0
import { useAuth0 } from '@auth0/auth0-react';

function DebugAuth() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  React.useEffect(() => {
    // Expose globally for debugging
    window.DEBUG_GET_TOKEN = async () => {
      try {
        const token = await getAccessTokenSilently();
        console.log('Token:', token);
        copy(token);
        return token;
      } catch (e) {
        console.error('Failed to get token:', e);
      }
    };
  }, [getAccessTokenSilently]);

  return null;
}

// Then in console: await window.DEBUG_GET_TOKEN()
```