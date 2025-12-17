const supabase = require('./supabase');

/**
 * FeatureFlags Utility
 * Handles reading and writing feature status to Supabase.
 */
class FeatureFlags {
    constructor() {
        this.cache = {}; // Simple in-memory cache to avoid DB hits on every request
        this.cacheTTL = 30000; // 30 seconds
        this.lastFetch = 0;
    }

    async _refreshCache() {
        if (Date.now() - this.lastFetch < this.cacheTTL && Object.keys(this.cache).length > 0) {
            return;
        }

        try {
            const { data, error } = await supabase.from('feature_flags').select('*');
            if (error) throw error;

            this.cache = {};
            data.forEach(flag => {
                this.cache[flag.feature_name] = flag;
            });
            this.lastFetch = Date.now();
            console.log("Refreshed feature flags cache.");
        } catch (error) {
            console.error("Failed to refresh feature flags:", error.message);
            // Don't blow up, just use stale or default
        }
    }

    async isEnabled(featureName) {
        await this._refreshCache();
        const flag = this.cache[featureName];
        // Default to true if flag missing (fail open)
        return flag ? flag.is_enabled : true;
    }

    async disableFeature(featureName, reason) {
        console.warn(`[FeatureFlags] Auto-disabling feature: ${featureName} Reason: ${reason}`);

        // Update DB
        const { error } = await supabase.from('feature_flags')
            .update({
                is_enabled: false,
                last_disabled_at: new Date(),
                disabled_reason: reason
            })
            .eq('feature_name', featureName);

        if (error) console.error("Failed to update feature flag in DB:", error);

        // Invalidate cache
        this.lastFetch = 0;
    }

    async enableFeature(featureName) {
        console.log(`[FeatureFlags] Re-enabling feature: ${featureName}`);

        const { error } = await supabase.from('feature_flags')
            .update({
                is_enabled: true,
                disabled_reason: null
            })
            .eq('feature_name', featureName);

        if (error) console.error("Failed to enable feature flag:", error);
        this.lastFetch = 0;
    }
}

module.exports = new FeatureFlags();
