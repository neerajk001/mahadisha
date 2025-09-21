# MasterCard Component

A reusable card component designed for consistency across all master components in the application. This component provides a standardized way to display entity information with actions.

## Features

- **Consistent Design**: Unified styling across all master components
- **Flexible Content**: Configurable title, subtitle, icon, and metadata
- **Action Buttons**: Built-in View, Edit, and Delete actions
- **Responsive**: Mobile-friendly design with responsive breakpoints
- **Accessible**: Proper ARIA labels and keyboard navigation
- **Customizable**: Optional props for different use cases

## Usage

### Basic Import

```tsx
import { MasterCard } from '../components/shared';
```

### Basic Example

```tsx
<MasterCard
  id="1"
  title="Sample Entity"
  subtitle="Entity Type"
  icon={peopleOutline}
  metaItems={[
    {
      icon: locationOutline,
      label: "Location",
      value: "Sample Location"
    },
    {
      icon: documentTextOutline,
      label: "Code",
      value: "SMP-001"
    }
  ]}
  onView={() => handleView("1")}
  onEdit={() => handleEdit("1")}
  onDelete={() => handleDelete("1")}
/>
```

### Grid Layout

Use the `master-cards-grid` class for consistent grid layout:

```tsx
<div className="master-cards-grid">
  {items.map((item) => (
    <MasterCard
      key={item.id}
      id={item.id}
      title={item.name}
      subtitle="Item Type"
      icon={itemIcon}
      metaItems={item.metaData}
      onView={() => handleView(item)}
      onEdit={() => handleEdit(item.id)}
      onDelete={() => handleDelete(item.id)}
    />
  ))}
</div>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | ✅ | Unique identifier for the entity |
| `title` | `string` | ✅ | Main title displayed on the card |
| `subtitle` | `string` | ❌ | Optional subtitle/type information |
| `icon` | `string` | ✅ | Ionicon name for the card icon |
| `metaItems` | `MetaItem[]` | ✅ | Array of metadata items to display |
| `onView` | `(id: string) => void` | ❌ | Callback for view action |
| `onEdit` | `(id: string) => void` | ❌ | Callback for edit action |
| `onDelete` | `(id: string) => void` | ❌ | Callback for delete action |
| `className` | `string` | ❌ | Additional CSS classes |

### MetaItem Interface

```tsx
interface MetaItem {
  icon: string;    // Ionicon name
  label: string;   // Display label
  value: string;   // Display value
}
```

## Styling

The component uses CSS classes that can be customized:

- `.master-card` - Main card container
- `.master-card-header` - Header section with icon and title
- `.master-card-content` - Content section with metadata
- `.master-card-actions` - Action buttons section
- `.master-cards-grid` - Grid layout container

### CSS Custom Properties

You can override default colors and spacing using CSS custom properties:

```css
.master-card {
  --card-background: your-color;
  --card-border-radius: 20px;
  --card-padding: 2rem;
}
```

## Migration Guide

### From Old Card Structure

**Before:**
```tsx
<div className="branch-card">
  <div className="branch-card-header">
    <div className="branch-card-icon">
      <IonIcon icon={icon} />
    </div>
    <div className="branch-card-title">
      <h3 className="branch-card-name">{title}</h3>
      <div className="branch-card-type">{subtitle}</div>
    </div>
  </div>
  <div className="branch-card-content">
    {/* metadata items */}
  </div>
  <div className="branch-card-actions">
    {/* action buttons */}
  </div>
</div>
```

**After:**
```tsx
<MasterCard
  id={id}
  title={title}
  subtitle={subtitle}
  icon={icon}
  metaItems={metaItems}
  onView={onView}
  onEdit={onEdit}
  onDelete={onDelete}
/>
```

### Grid Container Update

**Before:**
```tsx
<div className="branches-grid">
```

**After:**
```tsx
<div className="master-cards-grid">
```

## Examples by Component Type

### Rejection Master
```tsx
<MasterCard
  id={rejection.id}
  title={rejection.name}
  subtitle="Rejection Reason"
  icon={closeCircleOutline}
  metaItems={[
    {
      icon: documentTextOutline,
      label: "Code",
      value: `REJ-${rejection.id.slice(-3)}`
    },
    {
      icon: timeOutline,
      label: "Type",
      value: "Standard"
    }
  ]}
  onView={() => handleView(rejection)}
  onEdit={() => handleEdit(rejection.id)}
  onDelete={() => handleDelete(rejection.id)}
/>
```

### Partner Master
```tsx
<MasterCard
  id={partner.id}
  title={partner.name}
  subtitle="Partner Organization"
  icon={peopleOutline}
  metaItems={[
    {
      icon: locationOutline,
      label: "Address",
      value: partner.address
    },
    {
      icon: documentTextOutline,
      label: "Contact",
      value: partner.contact
    }
  ]}
  onView={() => handleView(partner)}
  onEdit={() => handleEdit(partner.id)}
  onDelete={() => handleDelete(partner.id)}
/>
```

### Page Management
```tsx
<MasterCard
  id={page.id}
  title={page.name}
  subtitle={page.url}
  icon={getIconComponent(page.icon)}
  metaItems={[
    {
      icon: documentTextOutline,
      label: "Icon",
      value: page.icon
    },
    {
      icon: timeOutline,
      label: "Status",
      value: "Active"
    }
  ]}
  onView={() => handleView(page)}
  onEdit={() => handleEdit(page)}
  onDelete={() => handleDelete(page.id)}
/>
```

## Best Practices

1. **Consistent Icons**: Use appropriate Ionicons for different entity types
2. **Meaningful Metadata**: Include relevant information in metaItems
3. **Action Handlers**: Always provide proper error handling in action callbacks
4. **Responsive Design**: Test on different screen sizes
5. **Accessibility**: Ensure proper keyboard navigation and screen reader support

## Troubleshooting

### Common Issues

1. **Missing Icon**: Ensure the icon prop uses a valid Ionicon name
2. **Layout Issues**: Use `master-cards-grid` class for proper grid layout
3. **Action Not Working**: Check that callback functions are properly defined
4. **Styling Conflicts**: Ensure MasterCard.css is imported after other styles

### Performance Tips

1. **Memoization**: Consider using React.memo for large lists
2. **Lazy Loading**: Implement virtual scrolling for very large datasets
3. **Image Optimization**: Optimize any custom icons or images used
