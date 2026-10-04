export type Author = {
    firstName:string;
    lastName:string;
    id:string;
}

/**
 * Same rule as public.is_active_member() (without the admin exception):
 * no end date, or an end date in the future.
 */
export const isMembershipActive = (expiresAt: string | null) =>
    expiresAt === null || new Date(expiresAt) > new Date();

/**
 * PostgREST filter keeping the authors whose membership is active.
 */
export const activeMembershipFilter = () =>
    `member_ship_expired_at.is.null,member_ship_expired_at.gt.${new Date().toISOString()}`;
