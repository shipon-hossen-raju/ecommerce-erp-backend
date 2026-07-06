import { Query } from "mongoose";

type QueryParams = Record<string, unknown>;

const RESERVED_QUERY_FIELDS = ["searchTerm", "sort", "limit", "page", "fields"];

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  private query: QueryParams;

  constructor(modelQuery: Query<T[], T>, query: QueryParams) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  // Search across the given fields (case-insensitive)
  search(searchableFields: string[]) {
    const searchTerm = this.query.searchTerm as string;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map((field) => ({
          [field]: { $regex: searchTerm, $options: "i" },
        })),
      } as any);
    }
    return this;
  }

  // Exact-match filters from remaining query params
  filter() {
    const queryObj = { ...this.query };
    RESERVED_QUERY_FIELDS.forEach((field) => delete queryObj[field]);

    if (Object.keys(queryObj).length) {
      this.modelQuery = this.modelQuery.find(queryObj as any);
    }
    return this;
  }

  sort() {
    const sort =
      (this.query.sort as string)?.split(",").join(" ") || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  fields() {
    const fields = (this.query.fields as string)?.split(",").join(" ") || "";
    if (fields) {
      this.modelQuery = this.modelQuery.select(fields);
    }
    return this;
  }

  async execute() {
    return this.modelQuery;
  }

  async countTotal() {
    const filterQuery = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(filterQuery);
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export default QueryBuilder;
