# Frontspace Menus Guide

This guide explains how menus are integrated from Frontspace CMS into your Next.js application.

## Table of Contents
1. [Overview](#overview)
2. [Menu Structure in CMS](#menu-structure-in-cms)
3. [Fetching Menus](#fetching-menus)
4. [Menu Integration in Header](#menu-integration-in-header)
5. [Menu Item Types](#menu-item-types)
6. [Multi-Level Menus](#multi-level-menus)
7. [Multi-Tenant Support](#multi-tenant-support)
8. [Mega Menu Implementation](#mega-menu-implementation)

---

## Overview

Menus in Frontspace CMS are structured navigation systems that support:
- **Hierarchical structure** - Up to 3 levels deep (parent → child → grandchild)
- **Multiple link types** - Internal pages, external URLs, or no link (dropdown parents)
- **Multi-tenant filtering** - Automatic filtering by store ID
- **Dynamic content** - Real-time updates from CMS

---

## Menu Structure in CMS

### Menu Object

A menu in Frontspace has this structure:

```typescript
{
  id: string                 // Unique menu ID
  name: string              // Menu name (e.g., "Main Navigation")
  slug: string              // Menu slug (e.g., "huvudmeny")
  store_id: string          // Store that owns this menu
  created_at: string
  updated_at: string
  items: MenuItem[]         // Top-level menu items
}
```

### Menu Item Object

Each menu item has this structure:

```typescript
{
  id: string                // Unique item ID
  menu_id: string           // Parent menu ID
  title: string             // Display text
  link_type: string         // 'internal' | 'external' | 'none'
  url?: string              // External URL (if link_type is 'external')
  slug?: string             // Page slug (if link_type is 'internal')
  page_id?: string          // Referenced page ID (if link_type is 'internal')
  target?: string           // '_blank' | '_self'
  css_class?: string        // Custom CSS classes
  parent_id?: string        // Parent item ID (null for top-level)
  sort_order: number        // Display order
  is_active: boolean        // Visibility toggle
  created_at: string
  page?: {                  // Populated page data (if page_id exists)
    id: string
    slug: string
    title: string
  }
  children?: MenuItem[]     // Nested child items
}
```

---

## Fetching Menus

### File: `lib/fetchMenus.ts`

This file provides functions to fetch menus from Frontspace CMS.

#### Main Function: `getMenuBySlug()`

```typescript
export async function getMenuBySlug(slug: string) {
  try {
    const [tenantClient, storeId] = await Promise.all([
      getTenantClient(),
      getCurrentStoreId()
    ])

    const data = await tenantClient.query<{ menuBySlug: any }>(`
      query GetMenuBySlug($storeId: String!, $slug: String!) {
        menuBySlug(storeId: $storeId, slug: $slug) {
          id
          name
          slug
          store_id
          created_at
          updated_at
          items {
            id
            menu_id
            title
            link_type
            url
            slug
            page_id
            target
            css_class
            parent_id
            sort_order
            is_active
            created_at
            page {
              id
              slug
              title
            }
            children {
              # Second level children
              id
              title
              link_type
              url
              slug
              page_id
              target
              page {
                id
                slug
                title
              }
              children {
                # Third level children
                id
                title
                link_type
                url
                slug
                page_id
                target
                page {
                  id
                  slug
                  title
                }
              }
            }
          }
        }
      }
    `, {
      storeId,
      slug
    })

    if (!data.menuBySlug) {
      console.warn(`Menu with slug "${slug}" not found for store ${storeId}`)
      return null
    }

    return data.menuBySlug
  } catch (error) {
    console.error(`Error fetching menu "${slug}":`, error)
    return null
  }
}
```

**Key Features:**
- **Multi-tenant support** - Automatically filters by current store ID
- **Nested children** - Fetches up to 3 levels deep
- **Page references** - Includes referenced page data
- **Error handling** - Graceful fallback to null

#### Helper Functions

```typescript
// Fetch main navigation menu
export async function getHuvudmeny() {
  return await getMenuBySlug('huvudmeny')
}

// Fetch small menu (top bar)
export async function getSmallMenu() {
  return await getMenuBySlug('small-menu')
}
```

---

## Menu Integration in Header

### File: `components/Header/Header.tsx`

The header component fetches and transforms menu data for use in the UI.

### Step 1: Fetch Menus

```typescript
// Fetch menus from Frontspace CMS
const huvudmenyData = await getHuvudmeny();
const smallMenuData = await getSmallMenu();
```

### Step 2: Transform Menu Items

The `transformMenuItem()` function converts CMS menu format to the format expected by the UI:

```typescript
const transformMenuItem = (item: any) => {
  if (!item) return null;

  const label = item.label || item.title;
  const linkType = item.type || item.link_type;
  const slug = item.pageSlug || item.slug;
  const pageId = item.pageId || item.page_id;

  // Determine the type based on link_type
  let type: string;
  let url: string | undefined;

  if (linkType === 'internal' && pageId) {
    // Internal page link - treat as reference
    type = 'reference';
    url = undefined;
  } else if (linkType === 'external' && item.url) {
    // External link - treat as custom URL
    type = 'custom';
    url = item.url;
  } else {
    // No link (for dropdown parents) or invalid
    type = linkType || 'none';
    url = item.url;
  }

  return {
    id: item.id,
    link: {
      label,
      type,
      url,
      reference: (type === 'reference' && pageId) ? {
        value: {
          slug
        }
      } : undefined
    },
    subMenu: item.children && item.children.length > 0
      ? item.children.map(transformMenuItem).filter(Boolean)
      : []
  };
};
```

### Step 3: Create Header Data

```typescript
const smallMenuTransformed = smallMenuData?.items
  ?.map(transformMenuItem)
  .filter((item): item is NonNullable<typeof item> => item !== null) || [];

const headerData: HeaderType = {
  id: 'main-header',
  name: 'Main Header',
  content: { blocks: [] },
  enableAlert: false,
  headsUpMessage: '',
  backgroundColor: undefined,
  textColor: undefined,
  link: undefined,
  navItems: huvudmenyData?.items
    ?.map(transformMenuItem)
    .filter((item): item is NonNullable<typeof item> => item !== null) || [],
  smallMenu: smallMenuTransformed,
  smallMenuStyle: {
    backgroundColor: '#0A0D26',
    textColor: '#ffffff'
  }
};
```

### Step 4: Pass to Client Component

```typescript
return (
  <HeaderClient
    headerData={headerData}
    kampanjCities={kampanjCities}
    kampanjBrands={kampanjBrands}
    availableFacets={availableFacets}
    bilkategorier={bilkategorier}
    services={services}
    orter={sortedOrter}
    tenantId={tenant.id}
    fordontyper={parentCategories}
  />
);
```

---

## Menu Item Types

### Internal Link (Page Reference)

Links to a page within the site.

**CMS Configuration:**
```json
{
  "title": "About Us",
  "link_type": "internal",
  "page_id": "abc-123",
  "slug": "om-oss"
}
```

**Rendered as:**
```jsx
<Link href="/om-oss">About Us</Link>
```

### External Link (Custom URL)

Links to an external website or custom URL.

**CMS Configuration:**
```json
{
  "title": "Contact",
  "link_type": "external",
  "url": "https://example.com/contact",
  "target": "_blank"
}
```

**Rendered as:**
```jsx
<a href="https://example.com/contact" target="_blank">Contact</a>
```

### No Link (Dropdown Parent)

Items that open dropdowns but don't navigate anywhere.

**CMS Configuration:**
```json
{
  "title": "Products",
  "link_type": "none",
  "children": [
    { "title": "Product 1", "link_type": "internal", "slug": "product-1" },
    { "title": "Product 2", "link_type": "internal", "slug": "product-2" }
  ]
}
```

**Rendered as:**
```jsx
<button onClick={toggleDropdown}>
  Products
  <ChevronDown />
</button>
<Dropdown>
  <Link href="/product-1">Product 1</Link>
  <Link href="/product-2">Product 2</Link>
</Dropdown>
```

---

## Menu Sorting and Ordering

### Sort Order Field

Every menu item has a `sort_order` field that determines its display position:

```typescript
{
  id: "item-1",
  title: "First Item",
  sort_order: 1,
  parent_id: null
}
```

### How Sorting Works

1. **Automatic Sorting in CMS**
   - The CMS automatically sorts menu items by `sort_order` when fetching
   - Lower numbers appear first (1, 2, 3, etc.)
   - Items with the same parent are sorted relative to each other

2. **Top-Level Items**
   - Items with `parent_id: null` are sorted at the top level
   - Example:
     ```
     sort_order: 1 → Home
     sort_order: 2 → Products
     sort_order: 3 → About
     sort_order: 4 → Contact
     ```

3. **Child Items**
   - Items with the same `parent_id` are sorted within that parent
   - Example (children of "Products"):
     ```
     parent_id: "products-id"
       sort_order: 1 → Cars
       sort_order: 2 → Services
       sort_order: 3 → Parts
     ```

4. **Changing Order**
   - In Frontspace CMS, drag and drop menu items to reorder
   - The CMS automatically updates `sort_order` values
   - Changes appear immediately on the frontend

### Example with Sort Order

```json
{
  "items": [
    {
      "id": "1",
      "title": "Home",
      "sort_order": 1,
      "parent_id": null
    },
    {
      "id": "2",
      "title": "Products",
      "sort_order": 2,
      "parent_id": null,
      "children": [
        {
          "id": "2-1",
          "title": "Cars",
          "sort_order": 1,
          "parent_id": "2"
        },
        {
          "id": "2-2",
          "title": "Services",
          "sort_order": 2,
          "parent_id": "2"
        }
      ]
    },
    {
      "id": "3",
      "title": "Contact",
      "sort_order": 3,
      "parent_id": null
    }
  ]
}
```

**Renders as:**
```
Home (sort_order: 1)
Products (sort_order: 2)
  ├── Cars (sort_order: 1)
  └── Services (sort_order: 2)
Contact (sort_order: 3)
```

---

## Parent-Child Relationships

### Understanding parent_id

The `parent_id` field creates the hierarchical structure:

```typescript
{
  id: "child-item-id",
  title: "Submenu Item",
  parent_id: "parent-item-id"  // References parent item's id
}
```

### Building the Hierarchy

1. **Top-Level Items (Parents)**
   - `parent_id: null` - These appear in the main navigation bar

   ```json
   {
     "id": "products",
     "title": "Products",
     "parent_id": null,
     "sort_order": 1
   }
   ```

2. **Second-Level Items (Children)**
   - `parent_id: "products"` - These appear under "Products"

   ```json
   {
     "id": "cars",
     "title": "Cars",
     "parent_id": "products",
     "sort_order": 1
   }
   ```

3. **Third-Level Items (Grandchildren)**
   - `parent_id: "cars"` - These appear under "Cars"

   ```json
   {
     "id": "new-cars",
     "title": "New Cars",
     "parent_id": "cars",
     "sort_order": 1
   }
   ```

### Complete Hierarchy Example

```json
{
  "items": [
    {
      "id": "products",
      "title": "Products",
      "parent_id": null,
      "link_type": "none",
      "sort_order": 1,
      "children": [
        {
          "id": "cars",
          "title": "Cars",
          "parent_id": "products",
          "link_type": "none",
          "sort_order": 1,
          "children": [
            {
              "id": "new-cars",
              "title": "New Cars",
              "parent_id": "cars",
              "link_type": "internal",
              "slug": "nya-bilar",
              "sort_order": 1
            },
            {
              "id": "used-cars",
              "title": "Used Cars",
              "parent_id": "cars",
              "link_type": "internal",
              "slug": "begagnade-bilar",
              "sort_order": 2
            }
          ]
        },
        {
          "id": "services",
          "title": "Services",
          "parent_id": "products",
          "link_type": "internal",
          "slug": "tjanster",
          "sort_order": 2
        }
      ]
    },
    {
      "id": "about",
      "title": "About",
      "parent_id": null,
      "link_type": "internal",
      "slug": "om-oss",
      "sort_order": 2
    }
  ]
}
```

**Renders as:**
```
Products (parent_id: null, sort_order: 1) [Dropdown]
  ├── Cars (parent_id: "products", sort_order: 1) [Dropdown]
  │   ├── New Cars (parent_id: "cars", sort_order: 1) [Link: /nya-bilar]
  │   └── Used Cars (parent_id: "cars", sort_order: 2) [Link: /begagnade-bilar]
  └── Services (parent_id: "products", sort_order: 2) [Link: /tjanster]
About (parent_id: null, sort_order: 2) [Link: /om-oss]
```

### How the Code Handles Relationships

The GraphQL query automatically nests children:

```graphql
items {
  id
  title
  parent_id
  children {        # Second level
    id
    title
    parent_id
    children {      # Third level
      id
      title
      parent_id
    }
  }
}
```

The `transformMenuItem()` function recursively processes children:

```typescript
const transformMenuItem = (item: any) => {
  return {
    id: item.id,
    link: { ... },
    subMenu: item.children && item.children.length > 0
      ? item.children.map(transformMenuItem).filter(Boolean)  // Recursive!
      : []
  };
};
```

---

## Multi-Level Menus

Menus support up to **3 levels** of nesting:

### Visual Structure

```
Huvudmeny (Main Menu)
├── Produkter (Products) [No Link, sort_order: 1, parent_id: null]
│   ├── Bilar (Cars) [No Link, sort_order: 1, parent_id: "products"]
│   │   ├── Nya bilar (New Cars) [Internal: /nya-bilar, sort_order: 1, parent_id: "cars"]
│   │   └── Begagnade bilar (Used Cars) [Internal: /begagnade-bilar, sort_order: 2, parent_id: "cars"]
│   └── Tjänster (Services) [No Link, sort_order: 2, parent_id: "products"]
│       ├── Service (Maintenance) [Internal: /service, sort_order: 1, parent_id: "services"]
│       └── Däckbyte (Tire Change) [Internal: /dackbyte, sort_order: 2, parent_id: "services"]
├── Om oss (About Us) [Internal: /om-oss, sort_order: 2, parent_id: null]
└── Kontakt (Contact) [External: https://example.com/contact, sort_order: 3, parent_id: null]
```

### Level Limits

- **Level 1 (Top-Level)**: `parent_id: null` - Main navigation bar
- **Level 2 (Submenus)**: `parent_id: "level-1-id"` - First dropdown level
- **Level 3 (Sub-Submenus)**: `parent_id: "level-2-id"` - Second dropdown level
- **No Level 4**: The system only supports 3 levels deep

---

## Multi-Tenant Support

### How It Works

1. **Store ID Filtering**
   - Each menu has a `store_id` field
   - GraphQL query automatically filters by current tenant's store ID
   - Only menus owned by the current tenant are returned

2. **Tenant Detection**
   ```typescript
   const { getCurrentTenant } = await import('@/lib/get-tenant');
   const tenant = await getCurrentTenant();
   ```

3. **Menu Fetching**
   ```typescript
   const [tenantClient, storeId] = await Promise.all([
     getTenantClient(),
     getCurrentStoreId()
   ]);

   // Query uses storeId to filter menus
   const data = await tenantClient.query(`
     query GetMenuBySlug($storeId: String!, $slug: String!) {
       menuBySlug(storeId: $storeId, slug: $slug) { ... }
     }
   `, { storeId, slug });
   ```

### Example Scenarios

**Scenario 1: Laholms Bil (localhost:3003)**
- Fetches menu with `store_id = "214649fd-a772-4e81-9fe4-feeb9018d8da"`
- Shows only Laholm-specific menu items

**Scenario 2: Newman Bil (localhost:3004)**
- Fetches menu with `store_id = "newman-bil-store-id"`
- Shows only Newman-specific menu items

**Scenario 3: Kronobergs Bil (localhost:3002)**
- Fetches menu with `store_id = "kronobergs-bil-store-id"`
- Shows only Kronobergs Bil-specific menu items

---

## Mega Menu Implementation

### Component: `components/Header/MegaMenu.tsx`

The MegaMenu component handles the display of multi-level navigation menus.

### Features

1. **Dynamic Dropdowns**
   - Opens/closes based on user interaction
   - Only one dropdown open at a time
   - Closes when clicking outside

2. **Menu Item Rendering**
   ```typescript
   {headerData?.navItems?.map((item) => {
     if (item.subMenu && item.subMenu.length > 0) {
       // Render dropdown parent
       return (
         <button onClick={() => toggleSheet(item.link.label)}>
           {item.link.label}
           <ChevronDown />
         </button>
       );
     } else {
       // Render direct link
       if (item.link.type === 'reference') {
         return (
           <Link href={`/${item.link.reference?.value?.slug}`}>
             {item.link.label}
           </Link>
         );
       } else if (item.link.type === 'custom') {
         return (
           <a href={item.link.url} target={item.link.target}>
             {item.link.label}
           </a>
         );
       }
     }
   })}
   ```

3. **Nested Children**
   ```typescript
   {item.subMenu?.map((subItem) => (
     <div key={subItem.id}>
       {subItem.link.type === 'reference' ? (
         <Link href={`/${subItem.link.reference?.value?.slug}`}>
           {subItem.link.label}
         </Link>
       ) : (
         <a href={subItem.link.url} target={subItem.link.target}>
           {subItem.link.label}
         </a>
       )}

       {/* Third level children */}
       {subItem.subMenu && subItem.subMenu.length > 0 && (
         <div className="ml-4">
           {subItem.subMenu.map((grandChild) => (
             <Link
               key={grandChild.id}
               href={`/${grandChild.link.reference?.value?.slug}`}
             >
               {grandChild.link.label}
             </Link>
           ))}
         </div>
       )}
     </div>
   ))}
   ```

4. **State Management**
   ```typescript
   const [openSheets, setOpenSheets] = useState<Record<string, boolean>>({
     products: false,
     services: false,
     brands: false,
     resources: false,
     about: false,
     service: false,
     anlaggningar: false,
   });

   const toggleSheet = (name: string) => {
     setOpenSheets(prev => {
       const wasOpen = prev[name];
       // Close all sheets first
       const newState = Object.keys(prev).reduce((acc, key) => {
         acc[key] = false;
         return acc;
       }, {} as Record<string, boolean>);

       // Only open if it wasn't already open
       if (!wasOpen) newState[name] = true;
       return newState;
     });
   };

   const closeSheet = () => {
     setOpenSheets(prev => {
       const newState = Object.keys(prev).reduce((acc, key) => {
         acc[key] = false;
         return acc;
       }, {} as Record<string, boolean>);
       return newState;
     });
   };
   ```

---

## Summary

### What Menus Provide:

✅ **Hierarchical Navigation** - Up to 3 levels deep
✅ **Multiple Link Types** - Internal, external, or no link
✅ **Multi-Tenant Support** - Automatic filtering by store ID
✅ **Dynamic Content** - Real-time updates from CMS
✅ **Type Safety** - Full TypeScript support
✅ **Error Handling** - Graceful fallbacks

### Key Files:

1. **[lib/fetchMenus.ts](lib/fetchMenus.ts)** - GraphQL queries for fetching menus
2. **[components/Header/Header.tsx](components/Header/Header.tsx)** - Server component that fetches and transforms menus
3. **[components/Header/HeaderClient.tsx](components/Header/HeaderClient.tsx)** - Client component that renders the header
4. **[components/Header/MegaMenu.tsx](components/Header/MegaMenu.tsx)** - Mega menu dropdown implementation

### How to Add a New Menu:

1. Create menu in Frontspace CMS with desired slug (e.g., "footer-menu")
2. Add helper function to `lib/fetchMenus.ts`:
   ```typescript
   export async function getFooterMenu() {
     return await getMenuBySlug('footer-menu')
   }
   ```
3. Fetch menu in your component:
   ```typescript
   const footerMenu = await getFooterMenu()
   ```
4. Transform and render menu items using the `transformMenuItem()` pattern

---

## Additional Resources

- [Frontspace Integration Guide](./FRONTSPACE_INTEGRATION_GUIDE.md)
- [Frontspace Pages Guide](./FRONTSPACE_PAGES_GUIDE.md)
- [Multi-Tenant Configuration](./MULTI-TENANT.md)
- [Troubleshooting Guide](./FRONTSPACE_TROUBLESHOOTING.md)
