const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://api.mohamedtalat.com/api";
const apiKey =
  process.env.NEXT_PUBLIC_API_KEY || "P4OIp8prRKBeO0kogfGViTNzmAT8UnzL";

/**
 * Fetch generic global website settings from backend
 */
export async function fetchSettings() {
  try {
    const res = await fetch(`${baseUrl}/settings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.error("fetchSettings Error:", err);
    return null;
  }
}

/**
 * Fetch sliders data from backend
 */
export async function fetchSliders() {
  try {
    const res = await fetch(`${baseUrl}/settings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];
    const json = await res.json();
    return json?.data?.sliders || [];
  } catch (err) {
    console.error("fetchSliders Error:", err);
    return [];
  }
}

/**
 * Fetch contact types for the contact form
 */
export async function fetchContactTypes() {
  try {
    const res = await fetch(`${baseUrl}/contact-types`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) return [];
    const json = await res.json();
    return json?.data || [];
  } catch (err) {
    console.error("fetchContactTypes Error:", err);
    return [];
  }
}

/**
 * Submit contact form data (Supports FormData for attachments)
 */
export async function submitContactForm(formData) {
  try {
    const res = await fetch(`${baseUrl}/contact-us`, {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
      },
      body: formData,
    });

    return res;
  } catch (err) {
    console.error("submitContactForm Error:", err);
    throw err;
  }
}

/**
 * Newsletter subscription
 */
export async function subscribeNewsletter(email) {
  try {
    const res = await fetch(`${baseUrl}/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
      body: JSON.stringify({ email: email.trim(), extra_key: null }),
    });

    return res;
  } catch (err) {
    console.error("subscribeNewsletter Error:", err);
    throw err;
  }
}

/**
 * Fetch pixels and scripts from backend
 */
export async function fetchPixelsScripts() {
  try {
    const res = await fetch(`${baseUrl}/pixels-scripts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) return [];
    const json = await res.json();
    return json?.data || [];
  } catch (err) {
    console.error("fetchPixelsScripts Error:", err);
    return [];
  }
}

/**
 * Fetch testimonials with pagination support
 */
export async function fetchTestimonials(params = {}) {
  try {
    const url = new URL(`${baseUrl}/testimonials`);
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined) url.searchParams.append(key, params[key]);
    });

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.error("fetchTestimonials Error:", err);
    return null;
  }
}

/**
 * Fetch conferences with pagination support
 */
export async function fetchConferences(params = {}) {
  try {
    const url = new URL(`${baseUrl}/conferences`);
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined) url.searchParams.append(key, params[key]);
    });

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.error("fetchConferences Error:", err);
    return null;
  }
}

/**
 * Access research vault/archive with password
 */
export async function accessVault(password, page = 1) {
  try {
    const res = await fetch(`${baseUrl}/vault/access?page=${page}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { success: false, message: errorData?.message || "Access denied" };
    }

    const json = await res.json();
    return {
      success: true,
      data: json?.data || null,
      message: json?.message || "Success",
    };
  } catch (err) {
    console.error("accessVault Error:", err);
    return { success: false, message: "Network error" };
  }
}

/**
 * Fetch all article types (categories)
 */
export async function fetchArticleTypes() {
  try {
    const res = await fetch(`${baseUrl}/article-types`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data || [];
  } catch (err) {
    console.error("fetchArticleTypes Error:", err);
    return [];
  }
}

/**
 * Fetch articles filtered by type
 */
export async function fetchArticlesList(typeSlug, params = {}) {
  try {
    const url = new URL(`${baseUrl}/articles`);
    if (typeSlug) {
      url.searchParams.append("type_slug", typeSlug);
    }
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== "") {
        url.searchParams.append(key, params[key]);
      }
    });

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      console.warn(`fetchArticlesList status ${res.status}`);
      return [];
    }
    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.error("fetchArticlesList Error:", err);
    return null;
  }
}

/**
 * Fetch a single article by slug
 */
export async function fetchArticleDetails(slug) {
  try {
    const res = await fetch(`${baseUrl}/articles/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.error("fetchArticleDetails Error:", err);
    return null;
  }
}

/**
 * Fetch all pages from backend
 */
export async function fetchPages() {
  try {
    const res = await fetch(`${baseUrl}/pages`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];
    const json = await res.json();
    return json?.data || [];
  } catch (err) {
    console.error("fetchPages Error:", err);
    return [];
  }
}

/**
 * Fetch all post categories
 */
export async function fetchPostCategories() {
  try {
    const res = await fetch(`${baseUrl}/post-categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json?.data?.data || [];
  } catch (err) {
    console.error("fetchPostCategories Error:", err);
    return [];
  }
}

/**
 * Fetch posts with optional category filter
 */
export async function fetchPosts(params = {}) {
  try {
    const url = new URL(`${baseUrl}/posts`);
    Object.keys(params).forEach((key) => {
      if (params[key]) url.searchParams.append(key, params[key]);
    });

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.error("fetchPosts Error:", err);
    return null;
  }
}

/**
 * Fetch a single post by slug
 */
export async function fetchPostDetails(slug) {
  try {
    const res = await fetch(`${baseUrl}/posts/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.error("fetchPostDetails Error:", err);
    return null;
  }
}

/**
 * Fetch podcasts with pagination support
 */
export async function fetchPodcasts(params = {}) {
  try {
    const url = new URL(`${baseUrl}/podcasts`);
    Object.keys(params).forEach((key) => {
      if (params[key]) url.searchParams.append(key, params[key]);
    });

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.error("fetchPodcasts Error:", err);
    return null;
  }
}

/**
 * Fetch Galleries with pagination
 */
export async function fetchGalleries(params = {}) {
  try {
    const url = new URL(`${baseUrl}/galleries`);
    Object.keys(params).forEach((key) => {
      if (params[key]) url.searchParams.append(key, params[key]);
    });

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "X-Api-Key": apiKey,
      },
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("fetchGalleries Error:", err);
    return null;
  }
}

/**
 * Ask Talat AI a question about an article
 */
export async function askTalatAI(articleId, message, history = []) {
  try {
    const res = await fetch(`${baseUrl}/articles/${articleId}/ask-ai`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Api-Key": apiKey,
      },
      body: JSON.stringify({
        message,
        history,
      }),
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json;
  } catch (err) {
    console.error("askTalatAI Error:", err);
    throw err;
  }
}
