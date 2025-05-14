export const courseIncludeOptions = {
  publisher: {
    select: {
      name: true,
      avatar: true,
    },
  },
  demo: {
    select: {
      url: true,
    },
  },
  courseData: {
    select: {
      title: true,
      videoUrl: true,
      videoLength: true,
      videoThumbnail: true,
    },
  },
  reviews: {
    select: {
      author: {
        select: {
          name: true,
          avatar: true,
        },
      },
      review: true,
      rating: true,
      Replies: true,
    },
  },
};

export const searchFilterOptions = (
  filterWith: any,
  Payload: any
): Array<Record<string, any>> => {
  let { sort, page, limit, fields } = Payload;
  const exc = ["sort", "page", "fields", "q", "limit"];
  exc.forEach((el) => delete Payload[el]);
  page = page || 1;
  limit = limit || 50;
  const skip = (page - 1) * limit;
  const options: Record<string, any> = {};
  const orderBy: Record<string, any> = {};
  const selected: Record<string, any> = {};
  Object.keys(filterWith).forEach((key) => {
    if (typeof filterWith[key] === "object") {
      Object.keys(filterWith[key]).forEach((op) => {
        const prismaOp =
          op === "gte" || op === "gt" || op === "lte" || op === "lt"
            ? op
            : null;
        if (prismaOp) filterWith[key][prismaOp] = Number(filterWith[key][op]);
      });
    } else {
      delete filterWith[key];
    }
  });
  options.skip = skip;
  options.take = +limit;
  if (fields) {
    fields.split(",").forEach((el: any) => (selected[el] = true));
    options.select = selected;
    options.select.id = true;
  }
  if (sort) {
    sort = sort.split(",");
    for (let i = 0; i < sort.length; i++) {
      const key = sort[i].replace("-", "");
      const value = sort[i].startsWith("-") ? "desc" : "asc";
      orderBy[key] = value;
    }
    options.orderBy = orderBy;
  }

  return [filterWith, options];
};
