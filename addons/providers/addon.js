import divhunt from 'divhunt';

const providers = divhunt.Addon('providers', (addon) =>
{
    addon.Field('id', ['string']);
    addon.Field('name', ['string']);
    addon.Field('slug', ['string']);
    addon.Field('description', ['string', '']);
    addon.Field('icon', ['string', '']);
    addon.Field('auth_type', ['string']);
    addon.Field('auth_config', ['object', {}]);
    addon.Field('base_url', ['string']);
    addon.Field('callback', ['function', null]);
    addon.Field('status', ['string', 'active']);
});

export default providers;
