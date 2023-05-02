export const generateParams = (params: Record<string, any>) => {
  const { skip, take, filter, sort } = params;

  const pagination: Partial<{ skip: number; take: number }> = {};
  let newFilter = {};
  let orderBy = {};

  if (filter && Object.keys(filter)?.length) {
    newFilter = Object.keys(filter).map((key) => {
      return { [key]: { endsWith: filter[key] } };
    })[0];
  }

  if (sort && Object.keys(sort)?.length) {
    orderBy = Object.keys(sort).map((key) => {
      return { [key]: sort[key] };
    });
  }

  if (skip) {
    pagination['skip'] = Number(skip);
  }
  if (take) {
    pagination['take'] = Number(take);
  }

  return {
    newFilter,
    orderBy,
    pagination,
  };
};
