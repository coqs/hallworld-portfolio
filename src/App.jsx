import { useEffect, useMemo, useState } from 'react'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { api } from './api'

const INITIAL_PORTFOLIO = {
  identity: { name: 'hallworld', title: 'Junior Security Developer', location: 'Doha, Qatar', email: 'hallworld@atomicmail.io' },
  links: [
    { label: 'GitHub', url: 'https://github.com/coqs' },
    { label: 'HackerOne', url: 'https://hackerone.com/hallworld' },
    { label: 'Art', url: 'https://www.deviantart.com/hallworld' },
  ],
  summary: 'Junior security developer and pentester focused on web application security, responsible disclosure, and building useful software. Comfortable moving between reconnaissance, exploitation, clean backend code, and practical frontend work.',
  experience: [
    { role: 'Independent Security Researcher', organization: 'Responsible disclosure and bug bounty programs', dates: '2025 — Present', bullets: ['Reported high-impact authorization and data-exposure issues through private programs without publishing sensitive target details.', 'Active in web application testing, reconnaissance, vulnerability validation, and clear engagement-style reporting.'] },
  ],
  education: [{ school: 'Cybersecurity studies', details: 'Network security, web application security, programming, cryptography, and intelligence fundamentals', dates: 'Current' }],
  skills: [
    { label: 'Security', value: 'Web application security, OWASP Top 10, reconnaissance, responsible disclosure, basic Linux hardening' },
    { label: 'Development', value: 'JavaScript, React, Node.js, Next.js, HTML/CSS, basic Python, basic C++' },
    { label: 'Tools', value: 'Burp Suite, Wireshark, Kali Linux, GitHub, REST APIs, Cloudflare Workers' },
  ],
  activities: ['Reverse engineering games', 'Bug bounty research', 'AI and robotics competitions'],
  awards: ['1st place — AI & Robotics 2026 Qatar competition, line-following challenge'],
  certifications: [],
}

const INITIAL_PROJECTS = [
  { id: 'yafc', title: 'YAFC — Yet Another File Cleaner', slug: 'yafc', summary: 'A modern Windows file-management and cleaning tool built around resumable sessions.', details: 'YAFC combines native folder picking, media/document/archive previews, keyboard-driven keep/delete decisions, completion statistics, and automatic session resume. The project uses a React frontend and Node/Express backend.', tech: ['JavaScript', 'React', 'Vite', 'Node.js', 'Express'], url: 'https://github.com/coqs/yafc', featured: 1 },
  { id: 'tryon', title: 'TryOn', slug: 'tryon', summary: 'An AI virtual try-on experiment using Gemini Nano Banana through OpenRouter.', details: 'TryOn explores image input and output workflows, including Base64 image handling between a separate frontend and backend. It was built to learn how to connect an image-generation model to a practical user flow.', tech: ['JavaScript', 'Gemini', 'OpenRouter', 'Node.js'], url: 'https://github.com/coqs/tryon', featured: 1 },
]

const INITIAL_POSTS = []

function usePortfolioData() {
  const [data, setData] = useState({ portfolio: INITIAL_PORTFOLIO, projects: INITIAL_PROJECTS, posts: INITIAL_POSTS, loading: true })
  useEffect(() => {
    Promise.all([api.portfolio(), api.projects(), api.posts()])
      .then(([portfolio, projects, posts]) => setData({ portfolio, projects, posts, loading: false }))
      .catch(() => setData((current) => ({ ...current, loading: false })))
  }, [])
  return data
}

function LinkList({ links = [] }) {
  return <div className="link-list">{links.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label} ↗</a>)}</div>
}

function Section({ title, children }) {
  return <section className="resume-section"><h2>{title}</h2>{children}</section>
}

function Resume({ portfolio, projects }) {
  const identity = portfolio.identity || INITIAL_PORTFOLIO.identity
  return <main className="resume-page">
    <header className="resume-header">
      <h1>{identity.name}</h1>
      <div className="contact-line"><span>{identity.title}</span><i>◆</i><span>{identity.location}</span><i>◆</i><a href={`mailto:${identity.email}`}>{identity.email}</a></div>
      <LinkList links={portfolio.links} />
    </header>
    <Section title="Summary"><p className="lead">{portfolio.summary}</p></Section>
    {portfolio.experience?.length > 0 && <Section title="Work Experience">{portfolio.experience.map((item, index) => <article className="resume-entry" key={`${item.role}-${index}`}><div className="entry-heading"><div><strong>{item.role}</strong><span>{item.organization}</span></div><time>{item.dates}</time></div><ul>{item.bullets?.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></article>)}</Section>}
    {portfolio.education?.length > 0 && <Section title="Education">{portfolio.education.map((item, index) => <article className="resume-entry compact" key={`${item.school}-${index}`}><div className="entry-heading"><div><strong>{item.school}</strong><span>{item.details}</span></div><time>{item.dates}</time></div></article>)}</Section>}
    {projects.length > 0 && <Section title="Selected Projects">{projects.map((project) => <article className="resume-entry project-entry" key={project.id || project.slug}><div className="entry-heading"><div><strong>{project.title}</strong><span>{project.summary}</span></div><a href={project.url} target="_blank" rel="noreferrer">Source ↗</a></div><p>{project.details}</p><div className="tags">{project.tech?.map((tech) => <span key={tech}>{tech}</span>)}</div></article>)}</Section>}
    {portfolio.skills?.length > 0 && <Section title="Skills"><div className="skill-list">{portfolio.skills.map((skill) => <p key={skill.label}><strong>{skill.label}:</strong> {skill.value}</p>)}</div></Section>}
    {portfolio.activities?.length > 0 && <Section title="Activities"><ul className="plain-list">{portfolio.activities.map((item) => <li key={item}>{item}</li>)}</ul></Section>}
    {portfolio.awards?.length > 0 && <Section title="Honors & Awards"><ul className="plain-list">{portfolio.awards.map((item) => <li key={item}>{item}</li>)}</ul></Section>}
    {portfolio.certifications?.length > 0 && <Section title="Certifications"><ul className="plain-list">{portfolio.certifications.map((item) => <li key={item}>{item}</li>)}</ul></Section>}
  </main>
}

function PostCard({ post, onOpen }) {
  return <article className="post-card"><div className="post-meta">{post.tags?.join(' · ') || 'Writeup'} {post.published_at ? ` · ${new Date(post.published_at).toLocaleDateString()}` : ''}</div><h3>{post.title}</h3><p>{post.excerpt}</p><button className="text-button" onClick={() => onOpen(post.slug)}>Read writeup ↗</button></article>
}

function Blog({ posts, selectedSlug, onOpen }) {
  const post = selectedSlug ? posts.find((item) => item.slug === selectedSlug) : null
  if (post) return <main className="content-page"><button className="back-button" onClick={() => onOpen(null)}>← All writeups</button><article className="post-detail"><div className="post-meta">{post.tags?.join(' · ')}</div><h1>{post.title}</h1><div className="markdown" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(post.body_markdown || '')) }} /></article></main>
  return <main className="content-page"><div className="page-intro"><p className="eyebrow">BLOGS & WRITEUPS</p><h1>Notes from the lab.</h1><p>Technical notes, security writeups, and things I learned while building.</p></div><div className="posts-grid">{posts.length ? posts.map((post) => <PostCard key={post.id || post.slug} post={post} onOpen={onOpen} />) : <div className="empty-state">No public writeups yet. The editor is ready for the first one.</div>}</div></main>
}

function Admin({ onLogout }) {
  const [portfolio, setPortfolio] = useState(null)
  const [projects, setProjects] = useState([])
  const [posts, setPosts] = useState([])
  const [json, setJson] = useState('')
  const [message, setMessage] = useState('')
  const [newPost, setNewPost] = useState({ title: '', slug: '', excerpt: '', body_markdown: '', tags: '', status: 'draft' })
  const refresh = () => Promise.all([api.portfolio(), api.projects(), api.posts()]).then(([p, pr, po]) => { setPortfolio(p); setJson(JSON.stringify(p, null, 2)); setProjects(pr); setPosts(po) })
  useEffect(() => { refresh().catch((error) => setMessage(error.message)) }, [])
  const savePortfolio = async () => { try { const saved = await api.savePortfolio(JSON.parse(json)); setPortfolio(saved); setJson(JSON.stringify(saved, null, 2)); setMessage('Portfolio saved.') } catch (error) { setMessage(error.message) } }
  const addPost = async (event) => { event.preventDefault(); try { await api.createPost({ ...newPost, tags: newPost.tags.split(',').map((tag) => tag.trim()).filter(Boolean) }); setNewPost({ title: '', slug: '', excerpt: '', body_markdown: '', tags: '', status: 'draft' }); await refresh(); setMessage('Post saved.') } catch (error) { setMessage(error.message) } }
  if (!portfolio) return <main className="content-page"><p>Loading editor…</p></main>
  return <main className="admin-page"><div className="admin-heading"><div><p className="eyebrow">ADMIN</p><h1>Keep the resume current.</h1></div><button className="button ghost" onClick={onLogout}>Log out</button></div>{message && <div className="notice">{message}</div>}<section className="admin-section"><div><h2>Portfolio content</h2><p>Edit the resume data as JSON. The public layout stays fixed and ATS-friendly.</p></div><textarea className="json-editor" value={json} onChange={(event) => setJson(event.target.value)} spellCheck="false" /><button className="button" onClick={savePortfolio}>Save portfolio</button></section><section className="admin-section"><div><h2>Projects</h2><p>Project CRUD is available through the API; the seeded projects can be edited from the database-backed admin surface.</p></div><div className="admin-list">{projects.map((project) => <div className="admin-row" key={project.id}><span><strong>{project.title}</strong><small>{project.url}</small></span><button className="text-button danger" onClick={async () => { await api.deleteProject(project.id); refresh() }}>Delete</button></div>)}</div></section><section className="admin-section"><div><h2>New writeup</h2><p>Markdown is rendered safely on the public page.</p></div><form className="admin-form" onSubmit={addPost}><input required placeholder="Title" value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} /><input required placeholder="Slug" value={newPost.slug} onChange={(e) => setNewPost({ ...newPost, slug: e.target.value })} /><input placeholder="Tags, comma separated" value={newPost.tags} onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })} /><textarea placeholder="Excerpt" value={newPost.excerpt} onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })} /><textarea className="markdown-editor" placeholder="Write in Markdown…" value={newPost.body_markdown} onChange={(e) => setNewPost({ ...newPost, body_markdown: e.target.value })} /><label className="checkbox"><input type="checkbox" checked={newPost.status === 'published'} onChange={(e) => setNewPost({ ...newPost, status: e.target.checked ? 'published' : 'draft' })} /> Publish immediately</label><button className="button" type="submit">Save writeup</button></form></section><section className="admin-section"><h2>Existing writeups</h2>{posts.length ? posts.map((post) => <div className="admin-row" key={post.id}><span><strong>{post.title}</strong><small>{post.status}</small></span><button className="text-button danger" onClick={async () => { await api.deletePost(post.id); refresh() }}>Delete</button></div>) : <p>No posts yet.</p>}</section></main>
}

function Login({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  return <main className="login-page"><form className="login-card" onSubmit={async (event) => { event.preventDefault(); try { await api.login(password); onLogin() } catch (e) { setError(e.message) } }}><p className="eyebrow">PRIVATE AREA</p><h1>Admin login</h1><p>Manage the resume and publish new writeups.</p><input autoFocus type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />{error && <div className="form-error">{error}</div>}<button className="button" type="submit">Continue</button></form></main>
}

export default function App() {
  const { portfolio, projects, posts, loading } = usePortfolioData()
  const [page, setPage] = useState(window.location.pathname.startsWith('/admin') ? 'admin' : window.location.pathname.startsWith('/blog') ? 'blog' : 'me')
  const [selectedSlug, setSelectedSlug] = useState(window.location.pathname.split('/')[2] || null)
  const [authenticated, setAuthenticated] = useState(false)
  const navigate = (nextPage, slug = null) => { const path = nextPage === 'me' ? '/' : nextPage === 'blog' ? (slug ? `/blog/${slug}` : '/blog') : '/admin'; window.history.pushState({}, '', path); setPage(nextPage); setSelectedSlug(slug); window.scrollTo(0, 0) }
  useEffect(() => { const onPop = () => { setPage(window.location.pathname.startsWith('/admin') ? 'admin' : window.location.pathname.startsWith('/blog') ? 'blog' : 'me'); setSelectedSlug(window.location.pathname.split('/')[2] || null) }; window.addEventListener('popstate', onPop); return () => window.removeEventListener('popstate', onPop) }, [])
  useEffect(() => { if (page === 'admin') api.session().then(() => setAuthenticated(true)).catch(() => setAuthenticated(false)) }, [page])
  const title = useMemo(() => page === 'blog' ? 'Blogs & Writeups' : page === 'admin' ? 'Admin' : 'Me', [page])
  return <><nav className="site-nav"><button className="brand" onClick={() => navigate('me')}>hallworld</button><div className="nav-links"><button className={title === 'Me' ? 'active' : ''} onClick={() => navigate('me')}>Me</button><button className={title === 'Blogs & Writeups' ? 'active' : ''} onClick={() => navigate('blog')}>Blogs & Writeups</button></div><button className="admin-link" onClick={() => navigate('admin')}>Admin</button></nav>{loading ? <main className="loading">Loading resume…</main> : page === 'admin' ? (authenticated ? <Admin onLogout={async () => { await api.logout(); setAuthenticated(false) }} /> : <Login onLogin={() => setAuthenticated(true)} />) : page === 'blog' ? <Blog posts={posts} selectedSlug={selectedSlug} onOpen={(slug) => navigate('blog', slug)} /> : <Resume portfolio={portfolio} projects={projects} />}<footer><span>hallworld · {new Date().getFullYear()}</span><span>Built with intent.</span></footer></>
}
