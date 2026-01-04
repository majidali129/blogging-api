import { QueryBuilder } from './index';

export class CommentQueryBuilder extends QueryBuilder {
  constructor(query: any, defaultSize?: string, user?: any) {
    super(query, defaultSize, user);
    this.setDefaultSelect();
  }

  private setDefaultSelect() {
    this.select = {
      id: true,
      content: true,
      likes: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          id: true,
          username: true,
          profileImage: true,
        },
      },
      _count: {
        select: {
          childComments: true,
        },
      },
    };
  }

  addPostFilter() {
    const { postId } = this.query;
    if (postId) {
      this.addWhereCondition('postId', postId);
    }
    return this;
  }

  addSearchFilter() {
    const { search = '' } = this.query;
    if (search) {
      this.addOrClause([
        { content: { contains: search, mode: 'insensitive' } },
      ]);
    }
    return this;
  }

  addAuthorFilter() {
    const { authorId } = this.query;
    if (authorId) {
      this.addWhereCondition('authorId', authorId);
    }
    return this;
  }

  addParentCommentFilter() {
    const { parentCommentId } = this.query;
    if (parentCommentId) {
      this.addWhereCondition('parentCommentId', parentCommentId);
    } else {
      // Get only top-level comments if no parent specified
      this.addWhereCondition('parentCommentId', null);
    }
    return this;
  }
}