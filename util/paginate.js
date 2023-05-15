function paginate(data, total, paging) {
  const previousPage = paging.page - 1;
  const leftover = total / (paging.page * paging.limit);

  return {
    currentPage: paging.page,
    previousPage: previousPage || null,
    nextPage: leftover <= 1 ? null : paging.page + 1,
    total,
    perPage: paging.limit,
    data,
  };
}

module.exports = {
  paginate,
};
