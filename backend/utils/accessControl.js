const hasUnlimitedAccess = (user) => {
    if (!user) return false;

    // Normalize roles
    // We expect user.roles to be an array if populated by the caller, otherwise we gather standard locations
    let gatheredRoles = Array.isArray(user.roles) ? user.roles : [];

    gatheredRoles.push(user.role);
    if (user.app_metadata) gatheredRoles.push(user.app_metadata.role);
    if (user.user_metadata) gatheredRoles.push(user.user_metadata.role);
    if (user.app_metadata) gatheredRoles.push(user.app_metadata.role);
    if (user.user_metadata) gatheredRoles.push(user.user_metadata.role);
    // REMOVED professional_role from privilege check to enforce strict separation

    // Flatten and clean
    const roles = gatheredRoles
        .flat()
        .filter(Boolean)
        .map(r => String(r).toLowerCase());

    console.log("Checking Access for Roles:", roles);

    // 1. HARDCODED PRIVILEGED ROLES (Never get limits)
    const privilegedRoles = [
        'admin', 'superuser', 'owner',
        'team', 'developer', 'support',
        'friend', 'friends', 'family',
        'friends_and_family', 'family_and_friends',
        'ambassador', 'ambassadors', 'ambassasors',
        'partner', 'vip'
    ];

    if (roles.some(r => privilegedRoles.includes(r))) return true;

    // 2. LIFETIME & PAIDS
    if (user.has_lifetime_access === true || user.plan === 'lifetime') return true;

    // 3. SUBSCRIPTION STATUS
    const validStatuses = ['active', 'trial', 'past_due']; // Be generous with past_due
    if (validStatuses.includes(user.subscription_status)) return true;

    // 4. PLAN CHECK (Standard/Pro/Enterprise)
    const paidPlans = ['pro', 'premium', 'enterprise', 'standard'];
    if (paidPlans.includes(user.plan_id) || paidPlans.includes(user.price_id)) return true;

    return false;
};

const requireAdmin = (req, res, next) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const userRole = (user.role || 'user').toLowerCase();

    // Only 'admin' or 'team' can manage blogs
    if (userRole !== 'admin' && userRole !== 'team') {
        return res.status(403).json({ error: 'Permission denied: Admin or Team access required' });
    }

    next();
};

module.exports = { hasUnlimitedAccess, requireAdmin };
