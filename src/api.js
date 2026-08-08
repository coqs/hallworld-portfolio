const base = import.meta.env.VITE_API_BASE_URL || '/api'

async function request(path, options = {}) {
  const response = await fetch(`${base}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.error || `Request failed (${response.status})`)
  return body
}

export const api = {
  portfolio: () => request('/portfolio'),
  projects: () => request('/projects'),
  posts: () => request('/posts'),
  post: (slug) => request(`/posts/${encodeURIComponent(slug)}`),
  login: (password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ password }) }),
  session: () => request('/auth/session'),
  logout: () => request('/auth/logout', { method: 'POST' }),
  savePortfolio: (portfolio) => request('/admin/portfolio', { method: 'PUT', body: JSON.stringify(portfolio) }),
  createProject: (project) => request('/admin/projects', { method: 'POST', body: JSON.stringify(project) }),
  updateProject: (id, project) => request(`/admin/projects/${id}`, { method: 'PATCH', body: JSON.stringify(project) }),
  deleteProject: (id) => request(`/admin/projects/${id}`, { method: 'DELETE' }),
  createPost: (post) => request('/admin/posts', { method: 'POST', body: JSON.stringify(post) }),
  updatePost: (id, post) => request(`/admin/posts/${id}`, { method: 'PATCH', body: JSON.stringify(post) }),
  deletePost: (id) => request(`/admin/posts/${id}`, { method: 'DELETE' }),
}
