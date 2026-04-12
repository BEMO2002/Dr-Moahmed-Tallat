const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://api.mohamedtalat.org/api";

/**
 * Fetch generic global website settings from backend
 */
export async function fetchSettings() {
  try {
    const res = await fetch(`${baseUrl}/settings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": "P4OIp8prRKBeO0kogfGViTNzmAT8UnzL",
      },
      next: { revalidate: 0 },
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
        "X-Api-Key": "P4OIp8prRKBeO0kogfGViTNzmAT8UnzL",
      },
      next: { revalidate: 0 },
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
        "X-Api-Key": "P4OIp8prRKBeO0kogfGViTNzmAT8UnzL",
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
        "X-Api-Key": "P4OIp8prRKBeO0kogfGViTNzmAT8UnzL",
      },
      body: formData, // Passing FormData directly
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
        "X-Api-Key": "P4OIp8prRKBeO0kogfGViTNzmAT8UnzL",
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
        "X-Api-Key": "P4OIp8prRKBeO0kogfGViTNzmAT8UnzL",
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
        "X-Api-Key": "P4OIp8prRKBeO0kogfGViTNzmAT8UnzL",
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
        "X-Api-Key": "P4OIp8prRKBeO0kogfGViTNzmAT8UnzL",
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
 * @param {string} password
 */
export async function accessVault(password) {
  try {
    const res = await fetch(`${baseUrl}/vault/access`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": "P4OIp8prRKBeO0kogfGViTNzmAT8UnzL",
      },
      body: JSON.stringify({ password }),
      next: { revalidate: 0 },
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
        "X-Api-Key": "P4OIp8prRKBeO0kogfGViTNzmAT8UnzL",
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json?.data || [];
  } catch (err) {
    console.error("fetchArticleTypes Error:", err);
    return [];
  }
}

/**
 * Fetch articles filtered by type
 * @param {string} typeSlug
 */
export async function fetchArticlesList(typeSlug, params = {}) {
  try {
    const url = new URL(`${baseUrl}/articles`);
    if (typeSlug) {
      url.searchParams.append("type_slug", typeSlug);
    }
    Object.keys(params).forEach((key) => {
      if (params[key]) url.searchParams.append(key, params[key]);
    });

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": "P4OIp8prRKBeO0kogfGViTNzmAT8UnzL",
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json?.data?.data || [];
  } catch (err) {
    console.error("fetchArticlesList Error:", err);
    return [];
  }
}

/**
 * Fetch a single article by slug
 * @param {string} slug
 */
export async function fetchArticleDetails(slug) {
  try {
    const res = await fetch(`${baseUrl}/articles/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": "P4OIp8prRKBeO0kogfGViTNzmAT8UnzL",
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.error("fetchArticleDetails Error:", err);
    return null;
  }
}

// /**
//  * Fetch a single article by slug
//  * @param {string} slug
//  */
// export async function fetchArticleDetails(slug) {
//   try {
//     const res = await fetch(`${baseUrl}/articles/${slug}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         "X-Api-Key": "P4OIp8prRKBeO0kogfGViTNzmAT8UnzL",
//       },
//       next: { revalidate: 60 },
//     });
//     if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//     const json = await res.json();
//     return json?.data || null;
//   } catch (err) {
//     console.error("fetchArticleDetails Error:", err);
//     return null;
//   }
// }

/**
 * Fetch all pages from backend
 */
export async function fetchPages() {
  try {
    const res = await fetch(`${baseUrl}/pages`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": "P4OIp8prRKBeO0kogfGViTNzmAT8UnzL",
      },
      next: { revalidate: 0 },
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
        "X-Api-Key": "P4OIp8prRKBeO0kogfGViTNzmAT8UnzL",
      },
      next: { revalidate: 60 },
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
 * @param {Object} params - { category_slug, page }
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
        "X-Api-Key": "P4OIp8prRKBeO0kogfGViTNzmAT8UnzL",
      },
      next: { revalidate: 60 },
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
 * @param {string} slug
 */
export async function fetchPostDetails(slug) {
  try {
    const res = await fetch(`${baseUrl}/posts/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": "P4OIp8prRKBeO0kogfGViTNzmAT8UnzL",
      },
      next: { revalidate: 60 },
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
 * @param {Object} params - { page }
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
        "X-Api-Key": "P4OIp8prRKBeO0kogfGViTNzmAT8UnzL",
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.error("fetchPodcasts Error:", err);
    return null;
  }
}

export async function fetchGalleries({ page = 1 } = {}) {
  try {
    const res = await fetch(`${baseUrl}/galleries?page=${page}`, {
      method: "GET",
      headers: {
        "X-Api-Key": "P4OIp8prRKBeO0kogfGViTNzmAT8UnzL",
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("fetchGalleries Error:", err);
    return null;
  }
}
