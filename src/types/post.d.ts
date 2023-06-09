export interface Frontmatter {
  id: string
  slug: string
  date: Date
  title: string
  summary?: string
  image?: string
  category?: string
  tags?: Array<string>
  author?: string
  metadata?: MetaData
  draft?: boolean
  readingTime?: number
}

export interface Post extends Frontmatter {
  content: ReactElement<any, string | JSXElementConstructor<any>>
}

export interface MetaData {
  title?: string
  ignoreTitleTemplate?: boolean
  canonical?: string
  robots?: MetaDataRobots
  description?: string
  openGraph?: MetaDataOpenGraph
  twitter?: MetaDataTwitter
}

export interface MetaDataRobots {
  index?: boolean
  follow?: boolean
}

export interface MetaDataImage {
  url: string
  width?: number
  height?: number
}

export interface MetaDataOpenGraph {
  url?: string
  siteName?: string
  images?: Array<MetaDataImage>
  locale?: string
  type?: string
}

export interface MetaDataTwitter {
  handle?: string
  site?: string
  cardType?: string
}
