import { Component, Prop, State, h } from '@stencil/core';
import { getBlogPost, getBlogPosts } from '../../prismic';
import { BlogPostDocument, BlogPostsResponse } from '../../models';

import { PrismicRichText } from '@ionic-internal/sites-shared';

@Component({
  tag: 'blog-page',
  styleUrl: 'blog-page.scss'
})
export class BlogPage {
  @Prop() slug: string;

  @State() posts?: BlogPostsResponse;
  @State() post?: BlogPostDocument;

  async componentWillLoad() {
    const { slug } = this;

    if (slug) {
      this.slug = slug;
      this.post = await getBlogPost(slug);
      console.log('Fetching blog post', slug, this.post);
    } else {
      this.posts = await getBlogPosts();
    }
  }

  constructor() {
    document.title = `Capacitor Blog - Build cross-platform apps with the web`;
  }

  render() {
    if (this.slug && this.post) {
      return (
        <BlogPost post={this.post} />
      )
    } else {
      return (
        <AllPosts posts={this.posts} />
      )
    }
  }
}

const getBlogPostUrl = (doc: BlogPostDocument) => `/url/${doc.data.slug}`;

const BlogPost = ({ post }: { post: BlogPostDocument, single?: boolean }) => (
  <div class="blog-post">
    <h1>{post.data.title}</h1>
    <PrismicRichText richText={post.data.content} />
    <disqus-comments url={getBlogPostUrl(post)} id={post.uid} />
  </div>
)

const AllPosts = ({ posts }: { posts: BlogPostsResponse }) =>
  posts.docs.map(p => <BlogPost post={p} single={false} />);
