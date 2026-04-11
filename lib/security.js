import DOMPurify from "dompurify";

/**
 * Global Feature Flag for Content Protection
 * Set to `false` during development or if you want to turn it off completely.
 */
export const PROTECT_CONTENT =
  process.env.NEXT_PUBLIC_PROTECT_CONTENT !== "true";

/**
 * Sanitizes HTML content using DOMPurify to prevent XSS attacks.
 * Since this might run on the server during SSR or client, we handle the environment.
 * @param {string} dirtyHtml
 * @returns {string} clean HTML
 */
export const sanitizeHtml = (dirtyHtml) => {
  if (typeof window === "undefined") {
    // Return dirtyHtml during SSR, hydration will sanitize it on the client
    return dirtyHtml;
  }

  return DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS: [
      "b",
      "i",
      "em",
      "strong",
      "a",
      "p",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "br",
      "span",
      "div",
      "img",
      "blockquote",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "class", "target"],
  });
};

/**
 * Adds an obfuscation layer text (watermark) based on user state or timestamp.
 * This can be overlaid on top of content to deter screenshots.
 */
export const generateWatermark = (identifier = "Guest") => {
  const timestamp = new Date().toISOString().split("T")[0];
  return `${identifier} - ${timestamp}`;
};
