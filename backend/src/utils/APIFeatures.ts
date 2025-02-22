import { PrismaClient, Prisma } from "@prisma/client";

type QueryString = Record<string, any>;

class ApiFeatures<T> {
  private prisma: PrismaClient;
  private model: keyof PrismaClient;
  private queryString: QueryString;
  private queryOptions: Prisma.UserFindManyArgs = {};

  constructor(
    prisma: PrismaClient,
    model: keyof PrismaClient,
    queryString: QueryString
  ) {
    this.prisma = prisma;
    this.model = model;
    this.queryString = queryString;
  }

  filter(): this {
    const queryObj = { ...this.queryString };
    const excFields = ["page", "sort", "limit", "fields"];
    excFields.forEach((field) => delete queryObj[field]);

    Object.keys(queryObj).forEach((key) => {
      if (typeof queryObj[key] === "object") {
        Object.keys(queryObj[key]).forEach((op) => {
          const prismaOp =
            op === "gte" || op === "gt" || op === "lte" || op === "lt"
              ? op
              : null;
          if (prismaOp) {
            queryObj[key][prismaOp] = Number(queryObj[key][op]);
          }
        });
      }
    });

    this.queryOptions.where = queryObj;
    return this;
  }

  sort(): this {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").map((field: string) => {
        const order: Prisma.SortOrder = field.startsWith("-") ? "desc" : "asc";
        return { [field.replace("-", "")]: order };
      });
      this.queryOptions.orderBy = sortBy;
    }
    return this;
  }

  limitFields(): this {
    if (this.queryString.fields) {
      this.queryOptions.select = this.queryString.fields
        .split(",")
        .reduce((acc: any, field: string) => {
          acc[field] = true;
          return acc;
        }, {});
    }
    return this;
  }

  paginate(): this {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 100;
    const skip = (page - 1) * limit;

    this.queryOptions.skip = skip;
    this.queryOptions.take = limit;

    return this;
  }

  async execute(): Promise<T[]> {
    return (this.prisma[this.model] as any).findMany(this.queryOptions);
  }
}

export default ApiFeatures;
