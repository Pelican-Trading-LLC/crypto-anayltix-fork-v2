'use client'

import { Article } from '@phosphor-icons/react'
import { FA_BLOG_POSTS } from '@/lib/forexanalytix-mock-data'
import { FABadge, FAPoweredBy } from '@/components/forexanalytix/fa-badge'

export function FABlogPosts() {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Article size={14} className="text-muted-foreground" />
          <span className="text-[11px] uppercase tracking-[1.5px] font-semibold text-muted-foreground">FA BLOG</span>
          <FABadge />
        </div>
      </div>
      <div className="space-y-3">
        {FA_BLOG_POSTS.map(post => (
          <div key={post.id} className="group cursor-pointer">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-muted text-muted-foreground">{post.category}</span>
              <span className="font-mono text-[10px] text-muted-foreground">{post.timestamp}</span>
              <span className="font-mono text-[10px] text-muted-foreground">&middot; {post.read_time}</span>
            </div>
            <h4 className="text-[13px] font-semibold group-hover:text-[#4A90C4] transition-colors">{post.title}</h4>
            <p className="text-[12px] text-muted-foreground mt-0.5">by {post.author}</p>
          </div>
        ))}
      </div>
      <FAPoweredBy />
    </div>
  )
}
