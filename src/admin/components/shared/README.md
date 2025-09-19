# Shared Components

This folder contains reusable components that can be used across all admin pages.

## Pagination Component

A fully responsive, modern pagination component with circular buttons and glass-morphism design.

### Usage

```tsx
import { Pagination } from '../components/shared';

// In your component
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPreviousPage={handlePreviousPage}
  onNextPage={handleNextPage}
  className="custom-class" // optional
/>
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `currentPage` | `number` | ✅ | Current active page number |
| `totalPages` | `number` | ✅ | Total number of pages |
| `onPreviousPage` | `() => void` | ✅ | Function to handle previous page navigation |
| `onNextPage` | `() => void` | ✅ | Function to handle next page navigation |
| `className` | `string` | ❌ | Optional additional CSS class |

### Features

- ✅ **Circular gradient buttons** with hover effects
- ✅ **Fully responsive** - adapts to mobile, tablet, and desktop
- ✅ **Glass-morphism design** - modern, translucent appearance
- ✅ **Accessibility support** - proper focus states and ARIA labels
- ✅ **Smooth animations** - fade-in and hover transitions
- ✅ **Auto-hide** - doesn't render if totalPages <= 1
- ✅ **Theme variants** - compact, minimal, and dark themes available

### Design Specifications

**Desktop:**
- Button size: 50px × 50px
- Container padding: 1.5rem
- Gap between elements: 1rem

**Tablet (≤768px):**
- Button size: 44px × 44px
- Container max-width: 280px
- Compact spacing

**Mobile (≤480px):**
- Button size: 40px × 40px
- Container max-width: 240px
- Minimal spacing

### Layout

```
[←] Page X of Y [→]
```

The component automatically centers itself and groups all elements together for a clean, professional appearance.

### Migration from Old Pagination

**Before:**
```tsx
<div className="pagination-container">
  <IonButton onClick={handlePreviousPage}>
    <IonIcon icon={chevronBackOutline} />
    Previous
  </IonButton>
  <span>Page {currentPage} of {totalPages}</span>
  <IonButton onClick={handleNextPage}>
    Next
    <IonIcon icon={chevronForwardOutline} />
  </IonButton>
</div>
```

**After:**
```tsx
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPreviousPage={handlePreviousPage}
  onNextPage={handleNextPage}
/>
```

### Theme Variants

You can use additional CSS classes for different themes:

```tsx
<Pagination className="compact" />     {/* Smaller padding */}
<Pagination className="minimal" />     {/* No background/shadow */}
<Pagination className="dark" />        {/* Dark theme */}
```

### Implementation Steps

1. **Import the component:**
   ```tsx
   import { Pagination } from '../components/shared';
   ```

2. **Replace existing pagination JSX:**
   Replace your current pagination div with the Pagination component

3. **Remove old pagination CSS:**
   Remove pagination-related CSS from your component's CSS file

4. **Test responsiveness:**
   Verify the pagination works correctly on mobile, tablet, and desktop

### Benefits

- 🎯 **Consistency** - Same design across all admin pages
- 🛠️ **Maintainability** - Single source of truth for pagination logic
- 📱 **Responsive** - Automatically adapts to all screen sizes
- ♿ **Accessible** - Built-in accessibility features
- 🎨 **Modern Design** - Glass-morphism and smooth animations
- 📦 **Lightweight** - Minimal bundle impact
