import onetype from 'onetype';

const connections = onetype.Addon('connections', (addon) =>
{
    addon.Table('connections');

    addon.Field('id', ['string']);
    addon.Field('team_id', ['string']);
    addon.Field('provider_id', ['string']);
    addon.Field('status', ['string', 'active']);
    addon.Field('credentials', ['string']);
    addon.Field('metadata', ['object', {}]);
    addon.Field('scopes', ['string', '']);
    addon.Field('expires_at', ['string']);
    addon.Field('updated_at', ['string']);
    addon.Field('created_at', ['string']);
    addon.Field('deleted_at', ['string']);
});

export default connections;
