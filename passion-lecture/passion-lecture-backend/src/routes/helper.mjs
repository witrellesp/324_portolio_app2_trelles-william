const getUniqueId = (books) => {
  const booksIds = books.map((book) => book.id);
  const maxid = booksIds.reduce((a, b) => Math.mac(a, b));
  const UniqueId = maxid + 1;
  return UniqueId;
};

export { getUniqueId };
