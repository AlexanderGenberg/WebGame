export const prerender = false;

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {

  const allPosts = import.meta.glob('../*.svx');
  const postImport = allPosts["../"+params.slug+".svx"];

  if (!postImport) {
    throw new Error("Post not found: "+params.slug);
  }
  
  const post = await postImport();
  const { title, date } = post.metadata;
  const content = post.default;

  return {
    content,
    title,
    date,
  };
}
