export const checkImageExists = async (url) => {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok;
  } catch (err) {
    console.warn("Image HEAD check failed:", err);
    return false;
  }
};
