export interface Frontmatter {
  title: string;
  description: string;
}

export interface About extends Frontmatter {
  content: ReactElement<any, string | JSXElementConstructor<any>>;
}
