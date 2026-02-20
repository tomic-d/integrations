import divhunt from 'divhunt';
import connections from '#connections/addon.js';

/* Functions */
import '#connections/functions/encrypt.js';
import '#connections/functions/decrypt.js';
import '#connections/functions/token.js';
import '#connections/functions/refresh.js';
import '#connections/functions/revoke.js';
import '#connections/functions/callback.js';

/* Commands */
import '#connections/items/commands/link.js';
import '#connections/items/commands/get.one.js';
import '#connections/items/commands/get.many.js';
import '#connections/items/commands/unlink.js';
import '#connections/items/commands/status.js';

/* Schema */
divhunt.DataSchema('connection', {
    id: ['string', null, true],
    team_id: ['string', null, true],
    provider_id: ['string', null, true],
    status: ['string', null, true],
    metadata: ['object'],
    scopes: ['string'],
    expires_at: ['string'],
    updated_at: ['string', null, true],
    created_at: ['string', null, true],
});

export default connections;
