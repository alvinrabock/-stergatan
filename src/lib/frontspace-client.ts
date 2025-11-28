/**
 * Frontspace Headless CMS Client
 *
 * This client provides methods to interact with the Frontspace GraphQL API
 * for fetching pages and other content from your headless store.
 */

export interface PageBlock {
  id: string
  type: string
  content: any
  styles: Record<string, any>
  responsiveStyles: Record<string, any>
}

export interface PageSettings {
  seoTitle?: string
  seoDescription?: string
  ogImage?: string
}

export interface PageContent {
  blocks: PageBlock[]
  pageSettings: PageSettings
}

export interface Page {
  id: string
  title: string
  slug: string
  status?: string
  created_at?: string
  updated_at?: string
  published_at?: string
  content: PageContent
}

export interface HeaderSettings {
  position?: string
  background?: string
  shadow?: boolean
  colorOnScroll?: string
  backgroundColorOnScroll?: string
  logoOnScroll?: string
  logoMode?: string
}

export interface FooterSettings {
  background?: string
  padding?: string
}

export interface StoreSettings {
  id: string
  name?: string
  domain?: string
  favicon?: string
}

export interface Conditions {
  visibility?: string
  pages?: string[]
  pageTypes?: string[]
  devices?: string[]
}

export interface TemplateContent {
  blocks: PageBlock[]
}

export interface Header {
  id: string
  name: string
  content: TemplateContent
  headerSettings?: HeaderSettings
  conditions?: Conditions
}

export interface Footer {
  id: string
  name: string
  content: TemplateContent
  footerSettings?: FooterSettings
  conditions?: Conditions
}

export interface MenuItem {
  id: string
  label: string
  url?: string
  type?: string
  pageId?: string
  pageSlug?: string
  openInNewWindow?: boolean
  children?: MenuItem[]
}

export interface Menu {
  id: string
  name: string
  items: MenuItem[]
}

export interface FormField {
  name: string
  label: string
  type: string
  required: boolean
  placeholder?: string
  options?: string[]
}

export interface Form {
  id: string
  name: string
  status: string
  fields: FormField[]
  email_settings?: {
    send_to_type?: string
    to_email?: string
    form_email_field?: string
    subject?: string
    send_confirmation_to_user?: boolean
    confirmation_subject?: string
    confirmation_message?: string
  }
  created_at?: string
  updated_at?: string
}

export class FrontspaceClient {
  private apiUrl: string
  public storeId: string
  private apiKey: string

  constructor(apiUrl: string, storeId: string, apiKey: string) {
    this.apiUrl = apiUrl
    this.storeId = storeId
    this.apiKey = apiKey
  }

  /**
   * Execute a GraphQL query against the Frontspace API
   */
  async query<T = any>(query: string, variables: Record<string, any> = {}): Promise<T> {
    try {
      // In development, don't cache. In production build, Next.js will cache at build time.
      const isDevelopment = process.env.NODE_ENV === 'development'

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-store-id': this.storeId,
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({ query, variables }),
        // Development: no cache (always fresh)
        // Production: cache with on-demand revalidation with tenant-specific tags
        cache: isDevelopment ? 'no-store' : 'force-cache',
        next: isDevelopment ? { revalidate: 0 } : {
          tags: [
            `frontspace-${this.storeId}`,
            `frontspace-menu-${this.storeId}`,
            `frontspace-data-${this.storeId}`
          ]
        },
        // Increase timeout to 60 seconds for slow API responses
        signal: AbortSignal.timeout(60000)
      })

      if (!response.ok) {
        // Try to get error details from response body
        let errorDetails = ''
        try {
          const errorBody = await response.text()
          errorDetails = errorBody ? ` - ${errorBody.substring(0, 200)}` : ''
        } catch {
          // Ignore if we can't read the body
        }
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}${errorDetails}`)
      }

      const { data, errors } = await response.json()

      if (errors) {
        // Check if errors are about null blocks (which we can handle)
        const hasNullBlocksError = errors.some((err: any) => {
          const errorMessage = err.message || ''
          const originalMessage = err.extensions?.originalError?.message || ''
          return (
            errorMessage.includes('Cannot return null for non-nullable field PageContent.blocks') ||
            originalMessage.includes('Cannot return null for non-nullable field PageContent.blocks') ||
            (errorMessage === 'Unexpected error.' && originalMessage.includes('PageContent.blocks'))
          )
        })

        // If we have partial data and it's a null blocks error, return the data
        // We'll fix the null blocks in the calling methods
        if (data && hasNullBlocksError) {
          console.warn('⚠️  GraphQL returned null blocks, using partial data and fixing...')
          return data as T
        }

        // For other errors, log and throw
        console.error('GraphQL Error:', JSON.stringify(errors, null, 2))
        throw new Error(`GraphQL Error: ${JSON.stringify(errors)}`)
      }

      return data as T
    } catch (error) {
      // Only log API errors, not GraphQL errors (already logged above)
      if (!(error instanceof Error && error.message.startsWith('GraphQL Error'))) {
        console.error('Frontspace API Error:', error)
      }
      throw error
    }
  }

  /**
   * Fetch a single page by slug
   */
  async getPage(slug: string): Promise<Page | null> {
    const data = await this.query<{ page: Page }>(`
      query GetPage($storeId: String!, $slug: String!) {
        page(storeId: $storeId, slug: $slug) {
          id
          title
          slug
          status
          created_at
          updated_at
          published_at
          content {
            blocks {
              id
              type
              content
              styles
              responsiveStyles
            }
            pageSettings {
              seoTitle
              seoDescription
              ogImage
            }
          }
        }
      }
    `, { storeId: this.storeId, slug })

    // Handle null or empty blocks gracefully
    if (data.page && data.page.content) {
      if (!data.page.content.blocks) {
        data.page.content.blocks = []
      }
    }

    return data.page
  }

  /**
   * Fetch all pages from the store
   */
  async getAllPages(): Promise<Page[]> {
    const data = await this.query<{ pages: Page[] }>(`
      query GetPages($storeId: String!) {
        pages(storeId: $storeId) {
          id
          title
          slug
          status
          created_at
          updated_at
          published_at
          content {
            blocks {
              id
              type
              content
              styles
              responsiveStyles
            }
            pageSettings {
              seoTitle
              seoDescription
              ogImage
            }
          }
        }
      }
    `, { storeId: this.storeId })

    const pages = data.pages || []

    // Handle null or empty blocks for each page
    pages.forEach(page => {
      if (page && page.content) {
        if (!page.content.blocks) {
          page.content.blocks = []
        }
      }
    })

    return pages
  }

  /**
   * Fetch all page slugs (useful for generateStaticParams)
   */
  async getAllPageSlugs(): Promise<string[]> {
    const data = await this.query<{ pages: Pick<Page, 'slug'>[] }>(`
      query GetPageSlugs($storeId: String!) {
        pages(storeId: $storeId) {
          slug
        }
      }
    `, { storeId: this.storeId })

    return data.pages?.map(page => page.slug) || []
  }

  /**
   * Fetch header template
   */
  async getHeader(): Promise<Header | null> {
    try {
      const data = await this.query<{ header: Header }>(`
        query GetHeader($storeId: String!) {
          header(storeId: $storeId) {
            id
            name
            content {
              blocks {
                id
                type
                content
                styles
                responsiveStyles
              }
            }
            headerSettings {
              position
              background
              shadow
              colorOnScroll
              backgroundColorOnScroll
              logoOnScroll
              logoMode
            }
            conditions {
              visibility
              pages
              pageTypes
              devices
            }
          }
        }
      `, { storeId: this.storeId })

      // Handle null or empty blocks gracefully
      if (data.header && data.header.content) {
        if (!data.header.content.blocks) {
          data.header.content.blocks = []
        }
      }

      return data.header
    } catch (error) {
      console.error('Error fetching header:', error)
      return null
    }
  }

  /**
   * Fetch footer template
   */
  async getFooter(): Promise<Footer | null> {
    try {
      const data = await this.query<{ footer: Footer }>(`
        query GetFooter($storeId: String!) {
          footer(storeId: $storeId) {
            id
            name
            content {
              blocks {
                id
                type
                content
                styles
                responsiveStyles
              }
            }
            conditions {
              visibility
              pages
              pageTypes
              devices
            }
          }
        }
      `, { storeId: this.storeId })

      // Handle null or empty blocks gracefully
      if (data.footer && data.footer.content) {
        if (!data.footer.content.blocks) {
          data.footer.content.blocks = []
        }
      }

      return data.footer
    } catch (error) {
      console.error('Error fetching footer:', error)
      return null
    }
  }

  /**
   * Fetch a menu by ID
   */
  async getMenu(menuId: string): Promise<Menu | null> {
    try {
      const data = await this.query<{ menu: any }>(`
        query GetMenu($storeId: String!, $id: String!) {
          menu(storeId: $storeId, id: $id) {
            id
            name
            items {
              id
              title
              link_type
              url
              slug
              page_id
              page {
                id
                title
                slug
              }
              target
              css_class
              is_active
              children {
                id
                title
                link_type
                url
                slug
                page_id
                page {
                  id
                  title
                  slug
                }
                target
                css_class
                is_active
              }
            }
          }
        }
      `, { storeId: this.storeId, id: menuId })

      // Transform the response to match our interface
      if (data.menu) {
        const transformItem = (item: any): MenuItem => ({
          id: item.id,
          label: item.title,
          url: item.url,
          type: item.link_type,
          pageId: item.page_id,
          // Use page.slug if available (for internal links), otherwise use item.slug
          pageSlug: item.page?.slug || item.slug,
          openInNewWindow: item.target === '_blank',
          children: item.children?.map(transformItem)
        })

        const menu = {
          id: data.menu.id,
          name: data.menu.name,
          items: data.menu.items.map(transformItem)
        }

        if (!menu.items || menu.items.length === 0) {
          return null
        }

        return menu
      }

      return null
    } catch (error) {
      console.error('Error fetching menu:', error)
      return null
    }
  }

  /**
   * Fetch a form by ID
   */
  async getForm(formId: string): Promise<Form | null> {
    try {
      const data = await this.query<{ form: any }>(`
        query GetForm($storeId: String!, $id: String!) {
          form(storeId: $storeId, id: $id) {
            id
            name
            status
            fields {
              name
              label
              type
              required
              placeholder
              options
            }
            email_settings {
              send_to_type
              to_email
              form_email_field
              subject
              send_confirmation_to_user
              confirmation_subject
              confirmation_message
            }
            created_at
            updated_at
          }
        }
      `, { storeId: this.storeId, id: formId })

      return data.form || null
    } catch (error) {
      // Log detailed error information for debugging backend issues
      console.error('Error fetching form:', {
        formId,
        storeId: this.storeId,
        error: error instanceof Error ? error.message : error
      })
      return null
    }
  }

  /**
   * Get store settings including favicon
   */
  async getStoreSettings(): Promise<StoreSettings | null> {
    try {
      const data = await this.query<{ storeSettings: any }>(`
        query GetStoreSettings($storeId: String!) {
          storeSettings(storeId: $storeId) {
            id
            name
            domain
            favicon
          }
        }
      `, { storeId: this.storeId })

      return data.storeSettings || null
    } catch (error) {
      console.error('Error fetching store settings:', error)
      return null
    }
  }
}

/**
 * Create a Frontspace client for a specific store ID
 * Used in multi-tenant setups where store ID varies by domain
 */
export function createClient(storeId: string): FrontspaceClient {
  return new FrontspaceClient(
    process.env.FRONTSPACE_ENDPOINT || process.env.FRONTSPACE_API_URL || 'http://localhost:3000/api/graphql',
    storeId,
    process.env.FRONTSPACE_API_KEY || ''
  )
}

/**
 * Default client using FRONTSPACE_STORE_ID from environment
 * @deprecated Use createClient(storeId) for multi-tenant support
 */
const client = new FrontspaceClient(
  process.env.FRONTSPACE_ENDPOINT || process.env.FRONTSPACE_API_URL || 'http://localhost:3000/api/graphql',
  process.env.FRONTSPACE_STORE_ID || '',
  process.env.FRONTSPACE_API_KEY || ''
)

export default client
