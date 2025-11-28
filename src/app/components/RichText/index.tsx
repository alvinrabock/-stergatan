/**
 * Simple RichText renderer for Frontspace CMS
 * Renders rich text content from Frontspace's format
 */

import React from 'react'

interface RichTextNode {
  type: string
  children?: RichTextNode[]
  text?: string
  [key: string]: any
}

interface LexicalFormat {
  root: {
    children: RichTextNode[]
    [key: string]: any
  }
  [key: string]: any
}

interface RichTextProps {
  data?: RichTextNode[] | LexicalFormat
  className?: string
  enableGutter?: boolean
  enableProse?: boolean
}

const RichText: React.FC<RichTextProps> = ({ data, className }) => {
  if (!data) {
    return null
  }

  // Handle Lexical format (with root object)
  let nodes: RichTextNode[]
  if (Array.isArray(data)) {
    nodes = data
  } else if (typeof data === 'object' && 'root' in data && data.root?.children) {
    nodes = data.root.children
  } else {
    return null
  }

  const renderNode = (node: RichTextNode, index: number): React.ReactNode => {
    // Text node
    if (node.text !== undefined) {
      let text: React.ReactNode = node.text

      // Apply text formatting
      if (node.bold) text = <strong key={index}>{text}</strong>
      if (node.italic) text = <em key={index}>{text}</em>
      if (node.underline) text = <u key={index}>{text}</u>
      if (node.strikethrough) text = <s key={index}>{text}</s>
      if (node.code) text = <code key={index} className="bg-gray-100 px-1 rounded">{text}</code>

      return text
    }

    // Element nodes
    const children = node.children?.map((child, i) => renderNode(child, i))

    switch (node.type) {
      case 'h1':
        return <h1 key={index} className="text-4xl font-bold mb-4">{children}</h1>
      case 'h2':
        return <h2 key={index} className="text-3xl font-bold mb-3">{children}</h2>
      case 'h3':
        return <h3 key={index} className="text-2xl font-bold mb-3">{children}</h3>
      case 'h4':
        return <h4 key={index} className="text-xl font-bold mb-2">{children}</h4>
      case 'h5':
        return <h5 key={index} className="text-lg font-bold mb-2">{children}</h5>
      case 'h6':
        return <h6 key={index} className="text-base font-bold mb-2">{children}</h6>
      case 'p':
      case 'paragraph':
        return <p key={index} className="mb-4">{children}</p>
      case 'ul':
        return <ul key={index} className="list-disc list-inside mb-4 ml-4">{children}</ul>
      case 'ol':
        return <ol key={index} className="list-decimal list-inside mb-4 ml-4">{children}</ol>
      case 'li':
      case 'listitem':
        return <li key={index} className="mb-1">{children}</li>
      case 'link':
        return (
          <a
            key={index}
            href={node.url || node.href || '#'}
            className="text-blue-600 hover:underline"
            target={node.newTab ? '_blank' : undefined}
            rel={node.newTab ? 'noopener noreferrer' : undefined}
          >
            {children}
          </a>
        )
      case 'blockquote':
      case 'quote':
        return (
          <blockquote key={index} className="border-l-4 border-gray-300 pl-4 italic mb-4">
            {children}
          </blockquote>
        )
      case 'code':
      case 'code-block':
        return (
          <pre key={index} className="bg-gray-100 p-4 rounded mb-4 overflow-x-auto">
            <code>{children}</code>
          </pre>
        )
      case 'hr':
        return <hr key={index} className="my-8 border-gray-300" />
      case 'br':
        return <br key={index} />
      default:
        // Default: render children in a div or return null
        return children ? <div key={index}>{children}</div> : null
    }
  }

  return (
    <div className={className}>
      {nodes.map((node, index) => renderNode(node, index))}
    </div>
  )
}

export default RichText
