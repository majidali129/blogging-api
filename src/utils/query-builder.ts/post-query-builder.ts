import { prisma } from "@/lib/prisma";
import { QueryBuilder } from ".";

type View = 'week' | 'month' | 'year' | 'latest' | 'infinity' | 'following' | 'discover';

export class PostQueryBuilder extends QueryBuilder {
    private view: View = 'infinity';
    constructor(query: any,  defaultSize?: string, user?: any) {
        super(query, defaultSize, user);
        this.view = query.view || 'infinity';
        this.setDefaultSelect();
    };

    private setDefaultSelect() {
        this.select = {
            id: true,
            title: true,
            slug: true,
            description: true,
            coverImage: true,
            isMemberOnly: true,
            tags: true,
            author: {
                select: {
                id: true,
                username: true,
                profileImage: true,
                },
            },
            createdAt: true,
            updatedAt: true,
            _count: {
                select: {
                comments: true,
                likes: true,
                bookmarks: true,
                },
            },
    };
    };

    addViewFilter() {
        const dateRange = this.getDateRange();
        if (dateRange) {
            this.addWhereCondition('createdAt', {
                gte: dateRange.startDate,
                lte: dateRange.endDate
            })
        };

        this.applySortingByView();
        return this
    }
    addSlugFilter() {
        if (this.query.slug) {
            this.addWhereCondition('slug', this.query.slug);
        }
        return this;
    }

    addSearchFilter() {
        const { search = '' } = this.query;
        if (search) {
            this.addOrClause(
                [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                    { summary: { contains: search, mode: 'insensitive' } },
                ]
            )
        };
        return this;
    }

    addTagFilter() {
        const { tags = '' } = this.query;
        if (tags && tags.length > 0) {
            const tagArray = tags.trim().split(',');
            this.addWhereCondition('tags', {
                hasSome: tagArray
            })
        };

        return this;
    };

    addMemberShipFilter() {
        const { isMemberOnly } = this.query;
        if (isMemberOnly !== undefined) {
            this.addWhereCondition('isMemberOnly', isMemberOnly==='true')
        };
        return this;
    };

    async addFollowingFilter() {
        if (this.view === 'following') {
            const followingIds = await prisma.follow.findMany({
                where: { followerId: this.user?.userId },
                select: { followingId: true }
            });
            if (followingIds.length > 0) {
                this.addWhereCondition('authorId', {
                    in: followingIds.map(f => f.followingId)
                })
            }
        }
        return this;
    };

    private getDateRange(): { startDate: Date, endDate: Date } | null {
        const now = new Date();
        const startDate = new Date();

        switch (this.view) {
            case 'week': {
                startDate.setDate(now.getDate() - 7);
                return { startDate, endDate: now }
            };
            case 'month': {
                startDate.setMonth(now.getMonth() - 1);
                return { startDate, endDate: now };
            }
            case 'year': {
                startDate.setFullYear(now.getFullYear() - 1);
                return { startDate, endDate: now };
            };
            case 'infinity':
            case 'latest':
            case 'following':
            case 'discover':
            default: {
                return null;
            }
        }
    }

    private applySortingByView() {
        if (this.view === 'discover') {
            this.setOrderBy({likes: {_count: 'desc'}})
        } else if (this.view === 'latest') {
            this.setOrderBy({ createdAt: 'asc' });
        } else {
            this.setOrderBy({createdAt: 'desc'})
        }
    }
}